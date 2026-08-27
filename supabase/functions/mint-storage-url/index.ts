// mint-storage-url — INF-9's R2 gatekeeper.
//
// The ONLY access path to R2 object storage. No direct/public/unauthenticated
// bucket read is ever permitted anywhere else. This function mints
// short-lived presigned URLs, scoped and gated per the M0 rule below.
//
//   POST /functions/v1/mint-storage-url
//   Headers: Authorization: Bearer <user JWT>
//   Body: { "bucket": "general" | "receipts" | "verification",
//           "key": "string", "operation": "read" | "write" }
//
//   200 { "url": "https://...", "expires_at": "<ISO8601>" }
//   401 { "error": "unauthenticated" }        — missing/invalid JWT
//   403 { "error": "location_not_available" } — bucket is receipts/verification,
//                                                ALWAYS denied at M0
//   403 { "error": "invalid_key_scope" }       — general bucket, key not under
//                                                caller's own uid prefix
//   400 { "error": "invalid_request" }         — malformed body
//
// M0 exact rule (no organizer/admin/KYC logic exists yet):
//   - general      -> any authenticated caller may mint a URL scoped to
//                      their own general/{auth.uid()}/... prefix
//   - receipts     -> unconditional 403, regardless of caller
//   - verification -> unconditional 403, regardless of caller
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.20";
import { getSupabaseForToken } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

type Bucket = "general" | "receipts" | "verification";
type Operation = "read" | "write";

interface RequestBody {
  bucket: Bucket;
  key: string;
  operation: Operation;
}

const VALID_BUCKETS: Bucket[] = ["general", "receipts", "verification"];
const VALID_OPERATIONS: Operation[] = ["read", "write"];
const URL_TTL_SECONDS = 300; // 5 minutes — short-lived by design

function isValidBody(x: unknown): x is RequestBody {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.bucket === "string" &&
    VALID_BUCKETS.includes(b.bucket as Bucket) &&
    typeof b.key === "string" &&
    b.key.length > 0 &&
    typeof b.operation === "string" &&
    VALID_OPERATIONS.includes(b.operation as Operation)
  );
}

function resolveBucketName(bucket: Bucket): string {
  const envPrefix = Deno.env.get("R2_ENV_PREFIX") ?? "dev";
  const bucketEnvVar = {
    general: "R2_BUCKET_GENERAL",
    receipts: "R2_BUCKET_RECEIPTS",
    verification: "R2_BUCKET_VERIFICATION",
  }[bucket];
  return Deno.env.get(bucketEnvVar) ?? bucket;
}

export async function handler(req: Request): Promise<Response> {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) return optionsResponse;

  const authHeader = req.headers.get("Authorization");
  const jwt = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!jwt) {
    return jsonResponse({ error: "unauthenticated" }, 401);
  }

  const supabase = getSupabaseForToken(jwt);
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return jsonResponse({ error: "unauthenticated" }, 401);
  }
  const uid = userData.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400);
  }
  if (!isValidBody(body)) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const { bucket, key, operation } = body;

  // M0 exact rule: receipts / verification are ALWAYS denied. No
  // organizer/admin/KYC logic exists yet to condition this on.
  if (bucket === "receipts" || bucket === "verification") {
    return jsonResponse({ error: "location_not_available" }, 403);
  }

  // bucket === "general" from here on.
  const envPrefix = Deno.env.get("R2_ENV_PREFIX") ?? "dev";
  const expectedPrefix = `${envPrefix}/general/${uid}/`;
  if (!key.startsWith(expectedPrefix)) {
    return jsonResponse({ error: "invalid_key_scope" }, 403);
  }

  const accountId = Deno.env.get("R2_ACCOUNT_ID");
  const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
  const endpoint = Deno.env.get("R2_ENDPOINT") ?? `https://${accountId}.r2.cloudflarestorage.com`;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return jsonResponse({ error: "storage_not_configured" }, 500);
  }

  const bucketName = resolveBucketName(bucket);
  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const method = operation === "write" ? "PUT" : "GET";
  const objectUrl = new URL(`${endpoint}/${bucketName}/${key}`);
  objectUrl.searchParams.set("X-Amz-Expires", String(URL_TTL_SECONDS));

  const signed = await client.sign(
    new Request(objectUrl.toString(), { method }),
    { aws: { signQuery: true } },
  );

  const expiresAt = new Date(Date.now() + URL_TTL_SECONDS * 1000).toISOString();

  return jsonResponse({ url: signed.url, expires_at: expiresAt }, 200);
}

if (import.meta.main) {
  Deno.serve(handler);
}

export { corsHeaders };

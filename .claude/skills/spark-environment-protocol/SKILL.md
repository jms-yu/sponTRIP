---
name: spark-environment-protocol
description: The stack-agnostic dev/stage/prod environment framework and its recipe library. Use whenever spark-architect is selecting an environment setup for Milestone 0/R, or spark-developer is building it. Generic principles apply to every project; the recipe is chosen per detected stack.
---

# SPARK Environment Protocol

Every project gets a real 3-tier environment setup, **“industry level,”** every time — but the concrete mechanics vary enormously by stack.

A Vercel preview-deploy pattern means nothing on an ESP32 project.

This protocol splits the concern into:

1. **Generic principles** that apply everywhere.
2. **A recipe library** selected per project.

---

## Generic Principles

The following principles apply regardless of the technology stack.

### 1. Separate Credentials Per Tier

Dev, stage, and prod **never share secrets**.

This is the same rule already stated in `spark-security-checklist`. This protocol makes that rule structural instead of merely a checklist item.

### 2. Promotion Gate Before Production

Code or a build moves to production **only through a reviewed, human-approved step**.

> Never promote automatically.

### 3. Smoke Test Before Promotion

Something concrete must confirm that the stage build actually works before it is promoted.

> A successful build alone is not sufficient evidence.

### 4. Rollback Path

A rollback procedure must be known **before** making a production promotion, not after something breaks.

---

# Recipe Library

`spark-architect` selects one of the following recipes during **Milestone 0/R stack detection**, based on what the project actually is.

---

## `web-vercel-supabase`

**Default recipe**

### Dev

- Local development.
- `.env.local`.

### Stage

- Vercel preview deployments per PR/branch.
- Separate Supabase branch or schema for isolated data.

### Prod

- Protected Vercel production project.
- Production Supabase instance with restricted access.
- Promotion = merge to the production branch with human approval.

---

## `hardware-esp32`

### Dev

- Bench setup.
- Development board.
- Serial monitor.

### Stage

- Dedicated test rig.
- Same firmware as production.
- Non-production hardware.

### Prod

- Flashing production units.
- Promotion = a human physically confirms that the stage rig behaves correctly before flashing real devices.

---

## `n8n`

### Dev

- Personal n8n workspace.
- Test credentials.

### Stage

- Separate n8n workspace/instance.
- Test webhooks.
- Sandbox credentials for the third-party services involved.

### Prod

- Client's live n8n instance.
- Promotion = manually rebuilding or importing the verified workflow into the client's instance.

> Never auto-push workflows, consistent with `spark-n8n-protocol`'s **“never generate JSON to build blind”** rule.

---

## `mobile-expo`

**React Native / Expo**

### Dev

- Expo Go / development client.
- Local development.

### Stage

- EAS Build internal distribution.
- Or TestFlight / Google Play Internal Testing.

### Prod

- Phased/staged store rollout.

> **Note:** OTA updates via EAS Update are a separate promotion path from full store releases. Decide and document which path this project uses for each type of change.

---

## `mobile-flutter`

### Dev

- Local device.
- Local simulator.

### Stage

- Firebase App Distribution.
- Or TestFlight / Google Play Internal Testing.

### Prod

- Phased/staged store rollout.
- Promotion via Fastlane or the respective store consoles directly.

---

## `mobile-native`

**Swift / Kotlin — no cross-platform framework**

### Dev

- Local device/simulator.
- Debug builds.

### Stage

- TestFlight for iOS.
- Google Play Internal Testing for Android.

### Prod

- Phased/staged store rollout.
- Platform-native release tooling, such as:
  - Xcode Cloud
  - Fastlane
  - Google Play Console

---

# No Recipe Matches

If no recipe matches the project:

1. Apply the **generic principles** directly.
2. Explicitly state `generic, no match` in `.spark/environment.md`.
3. Do **not** force the project into an incompatible recipe.
4. Flag the configuration as a candidate for a new recipe once the same pattern repeats across projects.

---

# Output

`spark-architect` writes the selected recipe, or **`generic, no match`**, into:

```text
.spark/environment.md
```

/**
 * Canonical PostHog analytics event schema (INF-6). This is the SINGLE
 * SOURCE OF TRUTH for every event name emitted anywhere in the app, from
 * every future milestone — locked now (M0) per decision 123, even though
 * no milestone before M2/M3/M6 has code that fires most of these yet.
 *
 * Why lock it now: this schema can't be backfilled if wrong, and the
 * repeat-join funnel (event_confirmed -> event_confirmed_repeat) is the
 * project's core success metric (decisions 23, 53, 116). Deliberately two
 * separate PostHog-native events rather than one event with a
 * first-vs-repeat property, to avoid PostHog's less-robust
 * property-based step deduping in funnel analysis.
 *
 * DO NOT rename or repurpose any of these once a real milestone starts
 * emitting them — that breaks funnel continuity. Add new events; don't
 * mutate existing ones.
 */
export const AnalyticsEvent = {
  /** { method: 'google' | 'apple' | 'email' } */
  UserSignedUp: "user_signed_up",
  /** { event_id, circle_id } */
  EventConfirmed: "event_confirmed",
  /** { event_id, circle_id } — fired IN ADDITION to EventConfirmed when
   * this is not the user's first-ever confirm. */
  EventConfirmedRepeat: "event_confirmed_repeat",
  /** { event_id, circle_id } */
  EventNoShow: "event_no_show",
  /** { event_id, circle_id } */
  EventCancelledExempt: "event_cancelled_exempt",
  /** { event_id, circle_id } */
  EventCancelledNonExempt: "event_cancelled_non_exempt",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export interface AnalyticsEventPropertiesMap {
  [AnalyticsEvent.UserSignedUp]: { method: "google" | "apple" | "email" };
  [AnalyticsEvent.EventConfirmed]: { event_id: string; circle_id: string };
  [AnalyticsEvent.EventConfirmedRepeat]: { event_id: string; circle_id: string };
  [AnalyticsEvent.EventNoShow]: { event_id: string; circle_id: string };
  [AnalyticsEvent.EventCancelledExempt]: { event_id: string; circle_id: string };
  [AnalyticsEvent.EventCancelledNonExempt]: { event_id: string; circle_id: string };
}

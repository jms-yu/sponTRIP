# SponTRIP — Product Ideation Document

## 1. Overview

SponTRIP connects people or friend groups who want to do the same activity, with the same group of people, at the same time — hikes, runs, motorcycle rides, sports sessions, coffee meetups, and spontaneous weekend trips.

## 2. Target Market

- **College students to professionals** — adventurous individuals who love to travel and join hobby-specific events.
- **Communities/organizations** — hobby groups or communities that organize trips/events.

## 3. Key Concepts & Glossary

| Term                    | Definition                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| **Sponter (Joiner)**    | Default user role. Navigates and joins events.                                               |
| **Sparker (Organizer)** | Role for users who organize events.                                                          |
| **Circle**              | A friend group a Sponter can create in-app, used to host **private** events.                 |
| **Hub**                 | An organization created by a Sparker. Must be verified before it can host **public** events. |
| **Drawing**             | UI/phase name for the **Pre-Event** stage.                                                   |
| **Coloring**            | UI/phase name for the **Event Proper** stage.                                                |
| **Painting**            | UI/phase name for the **Post-Event** stage.                                                  |

### Event Categories

| Category                      | Example sub-categories                                       |
| ----------------------------- | ------------------------------------------------------------ |
| Sports                        | Pickleball, basketball, soccer, etc.                         |
| Socialize                     | Coffee, meet-and-greets, networking/socializing events, etc. |
| Education                     | Study groups, seminars, etc.                                 |
| Tournament/Competition        | Card games, beyblade, RC cars, etc.                          |
| Rides                         | Motorcycles, bikes, sports cars, etc.                        |
| Nature                        | Mountain hiking, beach, diving, etc.                         |
| Outreach/Community Engagement | Tree planting, cleanup operations, rallies, etc.             |

### Private vs. Public Events

|                      | Private Events                   | Public Events               |
| -------------------- | -------------------------------- | --------------------------- |
| Created by           | Joiners                          | Organizers                  |
| Verification         | Not required                     | Required (earns a badge)    |
| Discoverability      | Accessible only via private link | Posted on the Navigate feed |
| Access requirement   | Friend Group (Circle) membership | Open registration           |
| Feature/admin access | Limited                          | Full                        |

## 4. App Navigation (5 Tabs)

1. **Navigate** — Home page; browse/search/filter and join events.
2. **My sponTRIPs** — A user's events across the three lifecycle phases (Drawing, Coloring, Painting).
3. **Create sponTRIP** (center tab) — Create a Circle, Hub, private event, or public event.
4. **Notification & Inbox** — System notifications and messages.
5. **Profile** — User info, badges, event history/album, groups, and ratings.

## 5. Onboarding & Authentication

### 5.1 Login

- Quick login via **Google** or **Facebook**.

### 5.2 Sign-up

Fields:

- First Name, Last Name
- Nickname (checked for uniqueness)
- Avatar
- Email
- Contact number
- Address (City)
- Password / Confirm password
- Captcha
- Acceptance of Terms & Conditions / privacy consent (dialog box)
- Signing up generates a unique User ID.

### 5.3 Interest/Hobby Setup ("Getting to Know You")

- User selects top 2–3 interests (**Category**) and hobbies (**Sub-category**). Used to power event recommendations.
- "How did you find us?" — Friends / Social Media / Organization or Groups / Others.
- New users default to the **Joiner** role.

## 6. Create Tab: Circles, Hubs & Events

Both Joiners and Organizers can create content here, but Joiners are limited to **private** events (via Circles) and Organizers to **public** events (via Hubs).

### 6.1 Create a Circle (Friend Group)

- Creator becomes the **Circle Leader**.
- Customizable details: Circle Name, Circle Photo, and an optional Tag/Initial (4–5 characters, displayed next to the username, e.g., "TRIP (Username)").
- Leader invites members by username search; invitees must accept.
- Creating a Circle auto-generates a group chat.

### 6.2 Create a Hub (Organization)

- Creator becomes the **Organization Master**.
- The Master must complete verification before the Hub creation is finalized. Verification requires:
  1. KYC
  2. ID and Face Verification
  3. Contract (with e-signature)
- Customizable details: Organization Name, Photo, Description, Year Established.
- Master invites Admins by username search; invitees must accept.
- Once verified, the Hub can create public events.

### 6.3 Create a Private Event (Joiner)

- Requires an existing Circle; no separate verification needed.
- Not posted to the public Navigate feed — accessible only via a shareable link/ID or by being a Circle member.
- Circle can create a poll first if undecided on the activity.
- Leader sets: Name, Description, Date, Venue, Timeline, Budget (Optional) (with a breakdown view), and a Notes/Rules list.
- No formal registration flow — entry is via group pass ("G/Pass") only.
- The event creator (Leader) still manually approves each join request.

### 6.4 Create a Public Event (Organizer)

- Requires a verified Hub.
- Once published, appears on the public Navigate feed.
- Event details: Name, Description, Category, Completion Badge (given to joiners — can use a pre-built template or a custom upload), Date, Venue, Capacity, Registration Fee (itemized list with auto-compute), Timeline, Images (e.g., past events, venue photos, posters), Notes/Rules.
- Registration setup:
  - **Dynamic form builder** (similar to Google Forms) — text fields, dropdowns, radio buttons, etc.
  - **Registration Fee** - This is a Addable List. Organizer can able to input the following fees of the event and the price. It will auto add upon iteration of fees. This will give transparency to the joiners what is the reason of the registration fee. If there is no Registration Fee, meaning they didn't add any fee, it will automatically mark as free event, the **Payment Method** section will not appear.
  - **Payment Method** - We will don't hold any money. Payment through Gcash/Bank. If the event has registration fee it will automatically add Text fields for account name and account number and also automatically required to add upload button(required field) for the joiners to upload their receipt.
  - **Confirmation Date Range** — a set window before the event when confirmed joiners must reconfirm their slot. If a joiner doesn't reconfirm, their slot opens to the waitlist on a first-come, first-served basis.
  - **Evaluation Form** — a generic template is provided by default and is editable by the organizer.
- On publish, the system auto-generates a shareable event link and a downloadable QR code for social media distribution.

## 7. Navigate Tab: Discovering Events (Joiner Flow)

- Browse a feed of events; filter by category, location, or organizer.
- Join directly by entering an event ID.
- A recommended list is generated from the user's set interests/hobbies, and updates based on past events/searches.
- If an event is at full capacity, the user can still register as **waitlisted**.
- **Warning/error handling:** if the user already has an existing/pending event on the same date, they receive a confirmation prompt before proceeding.

**Interaction pattern** (TikTok/Tinder-style swipe navigation):
| Gesture | Action |
|---|---|
| Swipe down | Next event |
| Swipe up | Previous event / reload |
| Swipe left | View event details |
| Swipe right | Register for event |

## 8. Approval Process

**Joiner:**

- Completes all organizer-set registration requirements and waits for approval.
- Gets notified whether approved or declined; can still re-register if declined.
- Can chat directly with the organizer.

**Organizer:**

- Views all joiners pending approval.
- Upon clicking, they can see the following details the joiners has been answered to the registration for them to review.
- Approves once all requirements are satisfied.
- Can reply to joiners via chat.

## 9. My sponTRIPs Tab: Event Lifecycle

Each event a user is part of shows a status: **Pending** (awaiting organizer approval), **Waitlisted** (event full), or **Accepted**. Events are also labeled Private or Public.

Each event moves through three phases, each with a distinct interface for Joiners and Organizers.

### 9.1 Phase 1 — Drawing (Pre-Event)

**Joiner view:**

- Event details: name, description, organizer name, timeline/calendar, countdown to event date, location, registration fee (with budget breakdown), images, notes/rules.
- Downloadable/shareable event template and link (link redirects to the event detail page).
- Event group chat (available once the organizer confirms the joiner) and direct messaging with the organizer.
- Optional alarm toggle and a day-before notification.
- **Slot confirmation:** as the event nears, the joiner must confirm attendance. Confirming triggers an email confirmation plus a generated check-in QR code.
- If the joiner fails to confirm in time, their slot expires and is automatically offered to the next waitlisted user (who must then register promptly); calendars update for both parties.
- Confirming also auto-adds the event to the user's in-app calendar, with optional Google Calendar sync.

> **Open question:** What should the error-handling/fallback be for a joiner's check-in QR code if they confirm and then later back out?

**Organizer view (via a "Manage Event" button, organizer-only):**

- Event status overview: number registered, number confirmed.
- Edit event details.
- Review pending approvals.
- Create announcements/reminders in the group chat.
- Manage joiners (message, block, kick) — informed by joiner reports or organizer discretion.
- Set a meetup point ahead of the event.
- Review and approve waitlisted joiners when a confirmed slot expires.

### 9.2 Phase 2 — Coloring (Event Proper)

**Joiner view:**

- Event-day notification.
- Presents check-in QR code (or manual entry code) to the organizer for attendance.
- Upon check-in, optionally generates a shareable social media image/template using a chosen template and photo.
- Optional shareable live-location link, for family/friends to track the trip for safety.
- Access to timeline/calendar, group chat, and direct messaging with the organizer.
- Can report members for inappropriate conduct (harassment, bullying, foul language); reports reflect on the reported user's account.

**Organizer view:**

- Takes attendance by scanning (or manually entering) joiner QR codes.
- Attendee list, with the ability to review reports.
- No-shows (despite prior confirmation) affect the joiner's reliability score — this is optional/discretionary, since a joiner can message the organizer with a valid reason.
- Can generate a shareable social media template for the event.
- Optional raffle feature for participants.

### 9.3 Phase 3 — Painting (Post-Event)

**Joiner view:**

- Answers the organizer's overall evaluation/rating form.
- Separately, can share their SponTRIP app experience (feedback on the app itself, not the event).
- Uploads event photos, which generate a ready-to-post video/image for social sharing.
- Receives badges (from the organizer and/or from SponTRIP) upon completing the evaluation; badges reflect on their profile.
- Can choose to follow or report the organizer.
- Completed event is added to the joiner's profile history (see Album, Section 11).

**Organizer view:**

- Closes the event, which triggers: evaluation form collection, badge distribution, and analytics generation.
- Views overall ratings and evaluations submitted by joiners.
- Can report a joiner.
- Can generate a shareable social media template for the event.
- Event data (ratings, photos, etc.) is added to the organizer's profile, building credibility for future events.

## 10. Notifications & Inbox Tab

**Notifications:**

- Status changes
- Confirmations
- Check-ins
- Evaluation form prompts
- Friend requests
- Hub requests
- Circle requests
- Reports

**Inbox:**

- Direct messages
- Organizer messages
- Group messages

## 11. Profile Tab

**A. User Profile**

- User info, User ID, editable profile
- Interests/hobbies
- Organization affiliation (if the user is an organizer)

**B. Badges**

- Badges earned from organizers
- Badges earned from SponTRIP (per category)
- _(See Open Questions — badge system needs further ideation.)_

**C. Past Events**

- Event history
- Journal
- **Album**: each event has its own customizable album (scrapbook-style, "cute" design). Users can add photos and short text descriptions. Limited to 3 pages, 2–3 images per page.

**D. Organizations/Friend Groups**

- Followed organizations
- My friend groups (Circles)
- Individual and Group "Drawing Rate" — a Filipino-slang term for trips/plans that get talked about but never actually happen ("puro plano lang").
- Friend group/organization rating

**E. Individual Rating**

- Individual reliability/rating score, based on organizer feedback across events.

**F. Account Settings**

- Personalization (Change Color of the app), Light mode/Dark mode, Policy/Terms and condition and other, log out, etc..

## 12. Open Questions / Items for Further Discussion

1. **QR check-in error handling:** If a joiner confirms their slot (and receives a check-in QR) but later backs out, what should happen to that QR code / how should the system handle it?
2. **Badge system design:** The full badge matrix (what badges exist, how they're earned, organizer vs. SponTRIP badges) is on hold pending further team discussion. Needs dedicated ideation — what badges to implement and their unlock criteria.
3. **Required Information** What are the needed information/Data/ContractAny relevant document for an app? (e.g., Terms and Condition, Policy, etc..)

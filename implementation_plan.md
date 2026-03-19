# FitCoach AI — Reference UI Redesign

Redesign the single-page dashboard to match the 4-tab reference UI (Dashboard, Workouts, AI Cat, Rank) while preserving **every existing feature** (workout logging, stats, AI motivation, AI chatbot, leaderboard, tournament, settings, subscription plans). Add an "Upgrade+" button in the top-right header area.

## User Review Required

> [!IMPORTANT]
> **Subscription button**: The reference UI shows no subscription button. I'll add a subtle pill-shaped **"Upgrade+"** button in the top-right header bar next to the chat icon. This keeps it visible across all tabs without cluttering the layout. Let me know if you'd prefer a different placement.

> [!IMPORTANT]
> **No backend changes needed** — all data endpoints (workouts, stats, AI motivation, chat, leaderboard/tournament) remain the same. This is purely a frontend UI restructure.

---

## Proposed Changes

### Component Architecture

The current monolithic [dashboard-shell.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/dashboard-shell.tsx) (685 lines) will be split into:

| File | Purpose |
|------|---------|
| [dashboard-shell.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/dashboard-shell.tsx) | Tab router + shared header + bottom nav |
| `tab-dashboard.tsx` | **Dashboard** — AI motivation card, streak/calories stats, workout log form, ranking teaser |
| `tab-workouts.tsx` | **Workouts** — workout history list |
| `tab-ai-chat.tsx` | **AI Cat** — full chat interface |
| `tab-rank.tsx` | **Rank** — leaderboard with podium + global rankings list |

---

### Design System — Reference UI Aesthetic

#### [MODIFY] [globals.css](file:///c:/Users/saksh/Downloads/workout/frontend/src/app/globals.css)

- Update warm cream background `#f5f0e8` (matches reference)
- Add bottom-nav bar styles with pill-shaped active indicator
- Add dark olive-green hero card gradient `#2d3d2f` → `#1a2a1c`
- Add stat card styles with rounded white cards
- Add chat bubble styles (cream for AI, dark green for user)
- Add ranking/podium styles
- Add pill-button styles for workout types (Strength, Cardio, Yoga)
- Add "Upgrade+" button style with green accent

---

### Tab Components

#### [MODIFY] [dashboard-shell.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/dashboard-shell.tsx)

- Add `activeTab` state (`"dashboard" | "workouts" | "ai-chat" | "rank"`)
- Render shared top header with avatar, "Performance" title, and Upgrade+ button
- Render bottom navigation bar matching reference (4 icons + labels)
- Conditionally render the active tab component
- Move data fetching + state management to remain here (shared across tabs)

#### [NEW] [tab-dashboard.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/tab-dashboard.tsx)

Reference: Dashboard screen — dark green AI motivation card, streak + calories stats, workout log form, ranking teaser strip

**Features preserved:**
- ✅ Daily AI Motivation quote with "Get Today's Plan" button
- ✅ Current streak stat card
- ✅ Calories card (mapped from total workout minutes)
- ✅ Log Workout form (activity type pills, duration, intensity/date)
- ✅ Save Session button
- ✅ Ranking teaser ("Top 5% this week" → links to Rank tab)
- ✅ Smart Insight section
- ✅ Goal & Coach Settings (accessible via a settings icon)

#### [NEW] [tab-workouts.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/tab-workouts.tsx)

Reference: Workouts screen — hero card, disciplines grid, daily routines list

**Features preserved:**
- ✅ Workout history list (most recent first) with pagination
- ✅ Activity type filter/categories display
- ✅ Duration and date for each entry

#### [NEW] [tab-ai-chat.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/tab-ai-chat.tsx)

Reference: AI Cat screen — chat bubbles, input bar, quick action buttons

**Features preserved:**
- ✅ Chat with AI Cat header + subtitle
- ✅ Scrollable message history (cream bubbles for AI, green for user)
- ✅ Timestamps on messages
- ✅ Quick action buttons (Start Workout, Adjust Intensity)
- ✅ Message input with send button
- ✅ Coach tone selector (kept in settings or as a toggle)
- ✅ Chat history persisted (same backend)

#### [NEW] [tab-rank.tsx](file:///c:/Users/saksh/Downloads/workout/frontend/src/components/tab-rank.tsx)

Reference: Rank screen — current standing hero, top 3 podium, global rankings list

**Features preserved:**
- ✅ Current rank display (#14 style hero card)
- ✅ Total XP + League (mapped from points + badges)
- ✅ Top 3 performers podium with avatars
- ✅ Global rankings scrollable list
- ✅ Tournament info (week challenge, progress)

---

### Existing Features — Preservation Map

| Feature | Current Location | New Location | Status |
|---------|-----------------|-------------|--------|
| Workout Logging (5 activities, duration, date) | dashboard-shell L390-442 | tab-dashboard | ✅ Preserved |
| Stats (streak, weekly, top activity, total mins) | dashboard-shell L354-375 | tab-dashboard | ✅ Preserved |
| AI Motivation Nudge | dashboard-shell L282-313 | tab-dashboard | ✅ Preserved |
| AI Q&A Chatbot | dashboard-shell L485-541 | tab-ai-chat | ✅ Preserved |
| Workout History + Pagination | dashboard-shell L445-483 | tab-workouts | ✅ Preserved |
| Leaderboard | dashboard-shell L565-598 | tab-rank | ✅ Preserved |
| Weekly Tournament | dashboard-shell L544-563 | tab-rank | ✅ Preserved |
| Goal & Coach Settings | dashboard-shell L600-633 | tab-dashboard (settings modal) | ✅ Preserved |
| Subscription Plans | dashboard-shell L635-658 | Upgrade+ button + modal | ✅ Preserved |
| Smart Insight | dashboard-shell L660-678 | tab-dashboard | ✅ Preserved |
| Profile (avatar, username, points, badges) | dashboard-shell L314-344 | Shared header | ✅ Preserved |
| Sign Out | dashboard-shell L341 | Settings area | ✅ Preserved |

---

## Verification Plan

### Browser Testing
1. Run `npm run dev` in the frontend directory
2. Open browser to `http://localhost:3000` 
3. Log in and verify each tab renders correctly
4. **Dashboard tab**: Confirm AI motivation card, stats grid, workout form, save session
5. **Workouts tab**: Confirm workout history list with pagination
6. **AI Cat tab**: Send a message, verify response, scroll history
7. **Rank tab**: Confirm leaderboard with podium and rankings list
8. **Upgrade+ button**: Visible in header, opens subscription modal
9. **Bottom nav**: All 4 tabs switch correctly with active indicator
10. Visual comparison with reference screenshots

### Manual Verification (by user)
- Verify the overall look/feel matches the reference UI aesthetic
- Confirm "Upgrade+" placement feels natural in top-right
- Test on mobile viewport to confirm responsive bottom nav

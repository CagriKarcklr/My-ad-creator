# Spendaily — App Blueprint for Content & Marketing Agents

> **Purpose of this file.** A single, self-contained brief that gives an AI agent everything it
> needs to write *about* Spendaily — App Store copy, social posts, blog articles, ad creative,
> landing pages, support docs, ASO keywords, email. It is **not** a code doc. If you need
> engineering detail, see `CLAUDE.md` and `memory/`. Keep this file in sync when positioning,
> pricing, or headline features change.
>
> **Golden rule:** Spendaily is the *calm, one-number* budgeting app. Everything you write should
> feel **calm, encouraging, and simple** — never preachy, never spreadsheet-y, never guilt-trippy.

---

## 1. The one-liner

**Spendaily turns your whole budget into one calm daily number — exactly what's safe to spend today.**

You log today's total spend in about 5 seconds. Whatever you don't spend rolls over to tomorrow or
goes toward a real savings goal. No bank connection, no receipt-scanning, no tracking every coffee.

**Elevator pitch (longer):** Most budgeting apps make you categorize every transaction and stare at
charts. Spendaily flips it: tell it how much you want to spend, and it gives you a single safe-to-spend
number each day. Underspend and the rest carries forward or fuels a goal (a trip, a gadget, a safety
net). It's budgeting for people who want to feel in control without doing the maths.

---

## 2. What the app is (facts)

| Field | Value |
|---|---|
| **Name** | Spendaily |
| **Category** | Personal finance / budgeting (mobile-first) |
| **Platforms** | iOS (App Store) + Android (Google Play) |
| **Tech** | Expo / React Native app; FastAPI + MongoDB backend |
| **Input model** | **Manual only — no bank connection.** A deliberate privacy/simplicity choice. |
| **Languages** | 14 locales: English, German, Spanish, French, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Turkish, Ukrainian, Chinese |
| **Auth** | Email/password (with verification), Apple Sign-In, Google |
| **Monetization** | Free core app + **Premium** subscription (monthly / yearly) with a **1-month free trial** |
| **Current version** | 8.3.1 (check `frontend/app.json` for the live number) |

> ⚠️ **Don't claim bank syncing, automatic transaction import, or AI that reads your statements.**
> Spendaily is intentionally manual. That's a *feature* (privacy, mindfulness), not a gap — frame it
> as "No bank connection. Just you and your number."

---

## 3. Who it's for (audience)

- **People who've bounced off traditional budgeting apps** because categorizing every transaction is
  exhausting. They want control without the chore.
- **Daily-spend-conscious people** living paycheck-to-paycheck or on a fixed discretionary budget who
  need to know "can I spend this today?"
- **Goal savers** — saving for a trip, a gadget, an emergency cushion — who want their restraint to
  visibly add up.
- **Variable-income earners** (freelancers, gig workers, tipped/commission, multiple paydays) — served
  by the premium **Flexible Pay** mode.
- **Couples** who want to budget money together without awkward maths — premium **Couple's Budgeting**.
- **Privacy-minded users** who don't want a third party connected to their bank.

**Emotional core:** the app sells *calm and control*. The enemy is money anxiety and the "where did it
all go?" feeling at month-end.

---

## 4. How it works (the core loop — explain this clearly in content)

1. **Set your number.** During onboarding you tell Spendaily how much you want for **flexible
   day-to-day spending** each period (rent, bills, savings and investments are excluded — this is
   *discretionary* money). Pick a budget period: monthly, weekly, or payday-to-payday.
2. **Get a daily limit.** Spendaily converts your budget into one calm daily amount: *"Today, you can
   spend up to X."*
3. **Log in ~5 seconds.** You don't itemize every purchase — you drop today's **total** spend (optional
   categories exist, but minimal input is the pitch).
4. **Rollover.** Spend under your limit and the leftover **rolls over** — it's added on top of
   tomorrow's number, or you can send it to a goal. Overspend and it carries the other way.
5. **Build streaks & goals.** Under-budget days build a **streak**; no-spend days get celebrated;
   leftover money fills **savings goals** you can actually "purchase" when ready.
6. **See the month at a glance.** A **calendar** view shows every day's spending and rollover; a
   **Summary** shows trends, a **Budget Health** score, and period history.

---

## 5. Feature inventory

### Free (core)
- **Daily spending number** with automatic daily **rollover** (the signature mechanic).
- **Fast logging** of daily totals (~5 seconds), optional categories with colors.
- **Calendar view** — whole month at a glance, per-day spend + rollover.
- **Budget periods** — monthly (1st→last), weekly (Mon→Sun), or custom/payday-to-payday.
- **Summary screen** — trends, period history, **Budget Health** score (under-budget %, consistency,
  efficiency).
- **Streaks & no-spend day** tracking.
- **6 visual palettes** (Standard is free), light + dark mode, animated "living wallpaper" backgrounds.
- **14 languages**, locale-aware currency & date formatting.
- Privacy-first: **no bank connection, manual input only.**

### Premium (subscription)
- **Goals that feel real** — set a target + date; Spendaily suggests how much to save daily and you
  watch them fill up, then "purchase" when ready.
- **Smart Daily Rollover** — auto-allocate leftover budget: carry forward or send to goals, you decide.
- **Complete Budgeting** — track your full financial picture (salary, rent, fixed expenses,
  investments) and compute your *true* daily discretionary budget.
- **Flexible Pay** — for variable or multiple paydays: log each payment and your daily allowance builds
  itself over rolling 30-day windows; reserves a daily slice for fixed bills; supports set-aside savings.
- **Month-end review** — a beautiful end-of-period summary: what you saved and where it goes.
- **Couple's Budgeting** — plan & track with a partner (One Pot shared budget, or Split with shared
  expenses). Both partners need Premium (Apple Family Sharing counts).
- **5 premium palettes** (Ocean, Sunset, Forest, Rosegold, Midnight) + customizable live backgrounds.
- **No-spend day tracking** and streak momentum framed as premium motivation.

> Premium positioning line (from the app): **"Save smarter. Reach goals faster."**
> Sub: *"Beautiful tools designed to help you save intentionally and reach your goals with calm, smart guidance."*

---

## 6. Differentiators (lead with these)

1. **One number, not a spreadsheet.** The entire budget collapses into "what's safe to spend today."
2. **~5-second logging.** Total spend, not line-item tracking. This is the daily-habit hook.
3. **Rollover that compounds.** Underspending is *visibly rewarded* — it carries forward or becomes a goal.
4. **No bank connection.** Private by design; nothing linked to your accounts.
5. **Calm, beautiful design.** Premium palettes, live backgrounds, gentle motion — finance that feels good.
6. **Handles real life.** Variable pay (Flexible Pay), couples, custom paydays — not just a tidy 1st-of-month salary.

---

## 7. Brand voice & tone

**Personality:** a calm, supportive friend who's good with money and never judges you.

| Do | Don't |
|---|---|
| Calm, warm, encouraging | Hype-y, salesy, urgent ("ACT NOW!!!") |
| Plain language, short sentences | Finance jargon, spreadsheet-speak |
| Empowering ("you decide", "you're in control") | Guilt, shame, scolding about overspending |
| Concrete & visual ("one daily number", "it rolls over") | Vague promises ("optimize your finances") |
| Celebrate small wins (streaks, no-spend days) | Fear-based money anxiety framing |

**Signature vocabulary (use consistently):** *calm daily number / daily limit · safe to spend today ·
rolls over / rollover · streak · no-spend day · goal · period · discretionary spending · Flexible Pay ·
Complete Budgeting · Couple's Budgeting · Budget Health.*

**Sample on-brand lines (real app copy):**
- "Today, you can spend up to …"
- "Spendaily turns your budget into one calm daily amount: exactly what's safe to spend today."
- "No need to track every coffee. Just drop today's total spend and Spendaily does the rest."
- "Spend under your limit and the rest carries into tomorrow."
- "Send what you don't spend toward real goals and watch them fill up."
- "Money, managed together." (couples)
- "Variable or multiple paydays? Log each payment and your daily budget builds itself." (Flexible Pay)

**Emoji:** sparingly, warm ones (💛, 🎉). Never spammy.

---

## 8. Design language (for visual/creative briefs)

- **Token-first design system** — 8px spacing base, soft glass shadows, blur/tilt/shimmer.
- **6 palettes:** Standard (free) + Ocean, Sunset, Forest, Rosegold, Midnight (premium). Every visual
  must read in **both light and dark mode** across all palettes.
- **Living wallpaper** — animated gradient backgrounds (default "Aurora Dawn"), gentle, premium feel.
- **Liquid Glass** accents reserved for the dock/top edge; content cards are frosted, not transparent.
- **Mood:** soft gradients, rounded geometry, generous whitespace, calm motion. Think "premium wellness
  app" more than "hard fintech dashboard."
- Aesthetic neighbors for creative reference: the polish of Copilot Money / Monarch, the calm of a
  meditation app, the friendliness of a habit tracker.

---

## 9. Pricing & trial (verify live numbers before quoting)

- **Free tier** with the core daily-number + rollover + calendar experience.
- **Premium:** monthly or yearly. **1-month free trial** ("You won't be charged until your trial ends.
  Cancel anytime."). Yearly is discounted vs monthly.
- **Trust framing used in-app:** "Secure payments · Apple-managed · Cancel anytime." Restore-purchases
  supported.
- ⚠️ **Exact prices and the yearly discount % are computed from live App Store / Google Play pricing and
  vary by region — do NOT hard-code a number in evergreen content.** Use "starts with a 1-month free
  trial" and "save with yearly" unless writing a region-specific asset with a confirmed price.

---

## 10. Approved claims vs. things to avoid

**Safe to say:**
- One calm daily number; ~5-second logging; automatic rollover; no bank connection / private by design;
  works with any payday schedule; goals, streaks, no-spend days; 14 languages; iOS + Android; beautiful
  themes with light & dark mode; budget together as a couple (Premium).

**Avoid / never claim:**
- Bank syncing, automatic transaction import, statement-reading AI, investment/brokerage features,
  credit-score or lending features, tax features.
- Specific user counts, ratings, revenue, or awards **unless given verified figures.**
- Specific prices in evergreen/global content (see §9).
- "Financial advice" — Spendaily is a budgeting tool, not a licensed advisor. Keep an informational tone.
- Promo codes (e.g. internal test codes) — never publish these.

---

## 11. ASO / keyword seeds (starting point, validate with real ASO data)

`budget app`, `daily budget`, `spending tracker`, `expense tracker`, `money manager`, `save money`,
`savings goals`, `budget planner`, `daily spending`, `no bank connection budget`, `simple budget app`,
`budgeting for couples`, `paycheck budgeting`, `envelope budgeting alternative`.
Angle keywords: *calm budgeting, mindful spending, one number budget.*

---

## 12. Content angle bank (ready-to-expand hooks)

- "What if your whole budget was just one number?"
- "The 5-second budgeting habit that actually sticks."
- "Why we built a budgeting app with no bank connection — on purpose."
- "Rollover: how underspending today pays you back tomorrow."
- "Budgeting when your income is different every month."
- "How to budget as a couple without a single argument about money."
- "Turn the money you *didn't* spend into the trip you *will* take."
- "No-spend days, streaks, and the quiet joy of staying under budget."
- "Stop categorizing every coffee. Start knowing what's safe to spend."

---

## 13. Quick-reference glossary (use these terms precisely)

- **Daily number / daily limit** — the single safe-to-spend amount for today.
- **Rollover** — unspent (or overspent) budget carried to the next day; can be redirected to goals.
- **Period** — the budget cycle: monthly, weekly, or payday-to-payday/custom.
- **Discretionary spending** — flexible day-to-day money only (rent, bills, savings, investments excluded).
- **Streak** — consecutive under-budget days.
- **No-spend day** — a day with zero logged spending (celebrated on the calendar).
- **Goal** — a savings target with an amount and date; "purchased" when funded.
- **Complete Budgeting** (Premium) — full-picture mode (salary, fixed costs, investments → true daily budget).
- **Flexible Pay** (Premium) — variable/multiple-payday mode with rolling 30-day allowance windows.
- **Couple's Budgeting** (Premium) — One Pot (shared) or Split (separate + shared expenses).
- **Budget Health** — a score from under-budget rate, consistency, and efficiency.

---

*Last updated: 2026-06-25. Source: live app config (`frontend/app.json`), in-app copy
(`frontend/src/i18n/locales/en.json`), `memory/PRD.md`, and project memory. Re-verify pricing, version,
and any metric before publishing.*

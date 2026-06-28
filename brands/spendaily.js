/**
 * Brand: Spendaily
 * A self-contained brand pack: identity, palette, fonts, and a starter set of
 * App-Store screens that mirror the live store listing. Kimi is grounded with
 * brands/spendaily-blueprint.md (loaded by js/kimi.js) so generated copy and
 * pills stay on-brand.
 */
(function () {
  window.BRANDS = window.BRANDS || {};

  // Soft pastel gradients in the Spendaily family (lavender → pink → peach …)
  const G = {
    lavender:   { type: 'gradient', colors: ['#EDE6FB', '#F3E0F0', '#FBE6DD'], stops: [0, 0.55, 1], angle: 165 },
    blush:      { type: 'gradient', colors: ['#FBE3EC', '#F6E0EE', '#FCEBD8'], stops: [0, 0.5, 1], angle: 160 },
    peach:      { type: 'gradient', colors: ['#FCEAD9', '#F8E1E6', '#F1E2F3'], stops: [0, 0.5, 1], angle: 170 },
    violet:     { type: 'gradient', colors: ['#E9E2FB', '#E5DEFA', '#F1E9FC'], stops: [0, 0.5, 1], angle: 180 },
    rose:       { type: 'gradient', colors: ['#F7E4EE', '#F1E2F4', '#E7E6FB'], stops: [0, 0.5, 1], angle: 175 },
    mint:       { type: 'gradient', colors: ['#E2F3EC', '#EAF0FB', '#F2E9FA'], stops: [0, 0.5, 1], angle: 165 },
    plumNight:  { type: 'gradient', colors: ['#2A1B4A', '#241844', '#1B1238'], stops: [0, 0.5, 1], angle: 165 },
  };

  // Theme palettes the user can flip a whole screen into (matches in-app palettes)
  const palettes = [
    { id: 'standard', name: 'Standard', theme: 'light', bg: G.lavender,  accent: '#7C3AED', accent2: '#34D399' },
    { id: 'ocean',    name: 'Ocean',    theme: 'light', bg: { type: 'gradient', colors: ['#DCEBFB', '#E2F1FB', '#EAF6FB'], stops: [0, 0.5, 1], angle: 165 }, accent: '#2563EB', accent2: '#06B6D4' },
    { id: 'sunset',   name: 'Sunset',   theme: 'light', bg: { type: 'gradient', colors: ['#FCE3D6', '#FBD9DE', '#FBD0E4'], stops: [0, 0.5, 1], angle: 165 }, accent: '#EA580C', accent2: '#F59E0B' },
    { id: 'forest',   name: 'Forest',   theme: 'light', bg: { type: 'gradient', colors: ['#DCF3E4', '#E4F4DD', '#EFF6DC'], stops: [0, 0.5, 1], angle: 165 }, accent: '#059669', accent2: '#84CC16' },
    { id: 'rosegold', name: 'Rose Gold',theme: 'light', bg: { type: 'gradient', colors: ['#FBE3EC', '#FBDCE3', '#FCE7D8'], stops: [0, 0.5, 1], angle: 165 }, accent: '#DB2777', accent2: '#FB7185' },
    { id: 'midnight', name: 'Midnight', theme: 'dark',  bg: G.plumNight, accent: '#A78BFA', accent2: '#34D399' },
  ];

  // Starter screens — mirror the live App Store screenshots. Each screen carries
  // its eyebrow, two-tone headline, subtitle, gradient, and a default pill set.
  // Pills are auto-scattered around the phone by the renderer; users/AI can move them.
  const screens = [
    {
      name: 'Today', eyebrow: 'TODAY', theme: 'light', bg: G.lavender,
      headline: [{ text: 'Know what you can', accent: false }, { text: 'safely spend today', accent: true }],
      subtitle: 'One calm number every morning — your daily budget, done.',
      screenNote: 'Home screen showing the daily safe-to-spend number, rollover, daily limit and streak.',
      pills: [
        { emoji: '💵', title: '+£93.36', subtitle: 'rolled over' },
        { emoji: '💷', title: '£108.34', subtitle: 'daily limit' },
        { emoji: '✅', title: 'On track', subtitle: '4 days in a row' },
        { emoji: '🔥', title: '4-day streak', subtitle: 'keep it going' },
        { emoji: '🔒', title: 'No bank access', subtitle: 'private by design' },
        { emoji: '⭐', title: 'Free to start', subtitle: 'Premium optional' },
      ],
      rating: { stars: 5, label: 'Loved by everyday budgeters' },
    },
    {
      name: 'Capture', eyebrow: 'CAPTURE', theme: 'light', bg: G.blush,
      headline: [{ text: 'Log it in', accent: false }, { text: 'five seconds', accent: true }],
      subtitle: 'Quick add, smart categories, or a one-tap daily total.',
      screenNote: 'Add-expense sheet with category chips and an Add as daily total option.',
      pills: [
        { emoji: '⏱️', title: 'Under 5 seconds', subtitle: 'quick add' },
        { emoji: '🍔', title: 'Food & Dining', subtitle: '' },
        { emoji: '🚗', title: 'Transport', subtitle: '' },
        { emoji: '🛒', title: 'Groceries', subtitle: '' },
        { emoji: '🛍️', title: 'Shopping', subtitle: '' },
        { emoji: '🧾', title: 'Daily total mode', subtitle: 'one tap, done' },
      ],
    },
    {
      name: 'Rollover', eyebrow: 'ROLLOVER', theme: 'light', bg: G.peach,
      headline: [{ text: 'Spent less today?', accent: false }, { text: 'It rolls over 🎉', accent: true }],
      subtitle: 'Leftover budget moves to tomorrow — or straight into a savings goal.',
      screenNote: 'Rollover decision sheet: roll to tomorrow or invest in goals.',
      pills: [
        { emoji: '🔁', title: 'Smart Rollover', subtitle: 'set & forget' },
        { emoji: '🎉', title: '+£42.53', subtitle: 'to tomorrow' },
        { emoji: '💜', title: 'Saved £31.03', subtitle: 'ready to route' },
        { emoji: '🌙', title: 'Every midnight', subtitle: 'rolls automatically' },
      ],
      rating: { stars: 5, label: '"It honestly feels like a game." — Priya S.' },
    },
    {
      name: 'Goals', eyebrow: 'GOALS', theme: 'light', bg: G.rose,
      headline: [{ text: 'Your goals.', accent: false }, { text: 'Within reach.', accent: true }],
      subtitle: 'Every pound saved today funds something you actually want.',
      screenNote: 'Goals screen with a progress ring, total saved and active goals.',
      pills: [
        { emoji: '🎯', title: '+2.4%', subtitle: 'goal progress' },
        { emoji: '✈️', title: 'Thailand trip', subtitle: '17% funded' },
        { emoji: '⌛', title: '6mo left', subtitle: 'ETA countdown' },
        { emoji: '👜', title: 'Bag · 100%', subtitle: 'goal purchased' },
        { emoji: '🏆', title: '1 achieved', subtitle: 'goals hit' },
      ],
    },
    {
      name: 'Categories', eyebrow: 'CATEGORIES', theme: 'light', bg: G.violet,
      headline: [{ text: 'See where every', accent: false }, { text: 'pound really goes', accent: true }],
      subtitle: 'Category donuts and trends that reveal the leaks.',
      screenNote: 'Spending-by-category donut chart with a legend of 8 categories.',
      pills: [
        { emoji: '📦', title: '8 categories', subtitle: 'auto-organised' },
        { emoji: '🚗', title: 'Transport · 13%', subtitle: '£105 this month' },
        { emoji: '🍴', title: 'Food · 12%', subtitle: '£100 this month' },
      ],
    },
    {
      name: 'Insights', eyebrow: 'INSIGHTS', theme: 'light', bg: G.violet,
      headline: [{ text: 'Smart insights.', accent: false }, { text: 'Zero spreadsheets.', accent: true }],
      subtitle: 'Budget overview, rollover timeline and your safe-to-save number.',
      screenNote: 'Summary screen with a budget overview ring, score and rollover timeline.',
      pills: [
        { emoji: '💯', title: 'Budget score', subtitle: '90% this period' },
        { emoji: '🧠', title: 'Smart insights', subtitle: 'daily guidance' },
        { emoji: '📈', title: '£67.53', subtitle: 'projected saving' },
      ],
    },
    {
      name: 'Calendar', eyebrow: 'CALENDAR', theme: 'light', bg: G.lavender,
      headline: [{ text: 'Know where your', accent: false }, { text: 'month stands', accent: true }],
      subtitle: 'A spending calendar of green days, streaks and small wins.',
      screenNote: 'Month calendar colour-coded by under / on-track / over days with no-spend stars.',
      pills: [
        { emoji: '⚡', title: 'Streaks', subtitle: 'auto-protected' },
        { emoji: '📅', title: 'Payday cycles', subtitle: 'or calendar month' },
        { emoji: '⭐', title: '7 no-spend days', subtitle: 'this month' },
        { emoji: '📅', title: '£37.84', subtitle: 'daily average' },
        { emoji: '🔥', title: '26 days under', subtitle: 'budget this month' },
        { emoji: '💚', title: '£832.47', subtitle: 'tracked this month' },
      ],
    },
    {
      name: 'Your style', eyebrow: 'YOUR STYLE', theme: 'light', bg: G.violet,
      headline: [{ text: 'Same clarity.', accent: false }, { text: 'Your personality.', accent: true }],
      subtitle: 'Five palettes, light or dark, live backgrounds — yours.',
      screenNote: 'Appearance settings with theme and palette pickers.',
      pills: [
        { emoji: '🎨', title: '6 palettes', subtitle: 'light, dark & live' },
      ],
    },
    {
      name: 'Create goal', eyebrow: 'CREATE', theme: 'light', bg: G.mint,
      headline: [{ text: 'Picture the goal.', accent: false }, { text: 'Fund it daily.', accent: true }],
      subtitle: 'Name it, add a photo, set a date — Spendaily paces the saving.',
      screenNote: 'Goal Studio design step: name, icon and photo for a new goal.',
      pills: [
        { emoji: '🎧', title: 'New headphones', subtitle: 'goal in progress' },
        { emoji: '✈️', title: 'Trip fund', subtitle: 'paced daily' },
      ],
    },
    {
      name: 'Privacy', eyebrow: 'PRIVACY', theme: 'dark', bg: G.plumNight,
      headline: [{ text: 'No bank linking.', accent: false }, { text: 'Ever.', accent: true }],
      subtitle: 'Private by design — track spending without connecting an account.',
      screenNote: 'Sign-in screen with Apple / Google / email and privacy badges.',
      pills: [
        { emoji: '🔒', title: 'Private & secure', subtitle: 'no bank access' },
        { emoji: '🌍', title: '60+ currencies', subtitle: '14 languages' },
        { emoji: '🛡️', title: 'No tracking', subtitle: 'your data stays yours' },
        { emoji: '✋', title: 'Manual control', subtitle: 'you own your data' },
      ],
    },
  ];

  window.BRANDS.spendaily = {
    id: 'spendaily',
    name: 'Spendaily',
    tagline: 'One calm daily number — exactly what’s safe to spend today.',
    blueprintUrl: 'brands/spendaily-blueprint.md',
    // Visual identity
    logoGradient: ['#8B7CF6', '#C084FC'],
    logoChar: 'S',
    theme: {
      accent: '#7C3AED',          // signature violet (accent headline line, eyebrow text)
      accent2: '#34D399',         // mint (eyebrow rules, accent bar)
      headlineBase: '#16161F',    // near-black for light backgrounds
      headlineBaseDark: '#FFFFFF',// for dark backgrounds
      subtitle: '#5E5E70',
      subtitleDark: 'rgba(255,255,255,0.78)',
      eyebrow: '#8B5CF6',
    },
    fonts: {
      display: 'Poppins',     // heavy, rounded grotesque for headlines
      body: 'DM Sans',        // clean body for subtitles/pills
    },
    palettes,
    gradients: G,
    screens,
  };
})();

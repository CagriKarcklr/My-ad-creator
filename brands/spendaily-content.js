/**
 * Spendaily content packs — curated, on-brand copy and pills derived from the
 * blueprint. These seed the in-app Text-set and Pill libraries (merged once into
 * localStorage), so the user can browse and reuse them without regenerating.
 */
(function () {
  window.BRAND_CONTENT = window.BRAND_CONTENT || {};

  const A = (l1, l2) => [{ text: l1, accent: false }, { text: l2, accent: true }];

  const textSets = [
    // Daily number
    { eyebrow: 'TODAY', headline: A('Know what you can', 'safely spend today'), subtitle: 'One calm number every morning — your daily budget, done.' },
    { eyebrow: 'TODAY', headline: A('One number.', 'Every single day.'), subtitle: "See exactly what's safe to spend before you tap your card." },
    { eyebrow: 'SPEND', headline: A('Can I afford this?', 'Check one number.'), subtitle: 'Open Spendaily, glance once, and spend without second-guessing.' },
    { eyebrow: 'CLARITY', headline: A('Stop guessing', "today's budget."), subtitle: 'Your daily allowance updates the moment you log a spend.' },
    { eyebrow: 'DAILY', headline: A('Your whole budget,', 'in one number.'), subtitle: 'No spreadsheets, no categories to wrangle — just today’s limit.' },
    // Rollover
    { eyebrow: 'ROLLOVER', headline: A('Spent less today?', 'It rolls over 🎉'), subtitle: 'Leftover budget moves to tomorrow — or into a savings goal.' },
    { eyebrow: 'ROLLOVER', headline: A('Underspend today,', 'win tomorrow.'), subtitle: "Every pound you don't spend carries straight into tomorrow." },
    { eyebrow: 'CARRY', headline: A('Unspent money', 'keeps working.'), subtitle: "Roll it to tomorrow or send it to something you're saving for." },
    { eyebrow: 'BONUS', headline: A('Skipped the takeaway?', 'Bank the win.'), subtitle: "Yesterday's restraint becomes today's extra spending room." },
    { eyebrow: 'MIDNIGHT', headline: A('Every midnight,', 'it rolls itself.'), subtitle: 'Smart rollover moves leftover budget for you, automatically.' },
    // Goals
    { eyebrow: 'GOALS', headline: A('Your goals.', 'Within reach.'), subtitle: 'Every pound saved today funds something you actually want.' },
    { eyebrow: 'GOALS', headline: A('Turn one day', 'into a getaway.'), subtitle: 'Name a goal, set a date, and watch the progress ring fill up.' },
    { eyebrow: 'SAVE', headline: A("From 'I'm broke'", "to 'I'm saving'."), subtitle: 'Daily micro-savings stack into trips, tech and treats.' },
    { eyebrow: 'GOALS', headline: A('Every yes', 'has a why.'), subtitle: 'Tie daily spending to goals that actually matter to you.' },
    { eyebrow: 'CREATE', headline: A('Picture the goal.', 'Fund it daily.'), subtitle: 'Spendaily paces the saving so the target never feels far.' },
    // Calendar / streaks
    { eyebrow: 'CALENDAR', headline: A('Know where your', 'month stands.'), subtitle: 'A spending calendar of green days, streaks and small wins.' },
    { eyebrow: 'STREAKS', headline: A('No-spend days,', 'but make it fun.'), subtitle: 'Lock in streaks and gold stars instead of guilt.' },
    { eyebrow: 'MONTH', headline: A('See your month,', 'not your mess.'), subtitle: 'Spot overspending before it snowballs, day by day.' },
    { eyebrow: 'HABITS', headline: A('Money habits,', 'in colour.'), subtitle: 'Green days and gold stars that actually keep you on track.' },
    // Insights / payday
    { eyebrow: 'INSIGHTS', headline: A('Smart insights.', 'Zero spreadsheets.'), subtitle: 'Budget overview, rollover timeline and your safe-to-save number.' },
    { eyebrow: 'PAYDAY', headline: A('Am I okay', 'for payday?'), subtitle: 'See how much is left for the month in seconds, not sheets.' },
    { eyebrow: 'SCORE', headline: A('On track,', 'or drifting?'), subtitle: 'Your budget health score gives a clear yes or no.' },
    { eyebrow: 'MONTH-END', headline: A('End the month', 'with money left.'), subtitle: 'Daily limits and rollovers keep you out of payday panic.' },
    // Categories
    { eyebrow: 'CATEGORIES', headline: A('See where every', 'pound really goes.'), subtitle: 'Category donuts and trends that reveal the leaks.' },
    { eyebrow: 'CATEGORIES', headline: A('Find the leaks', 'in your spending.'), subtitle: 'Colour-coded categories show exactly where it adds up.' },
    // Logging
    { eyebrow: 'CAPTURE', headline: A('Log it in', 'five seconds.'), subtitle: 'Quick add, smart categories, or a one-tap daily total.' },
    { eyebrow: 'FAST', headline: A('Budgeting that fits', 'in a coffee queue.'), subtitle: "Open, log the amount, done before your order's ready." },
    { eyebrow: 'CAPTURE', headline: A('Spent without tracking?', 'Fix it fast.'), subtitle: 'Drop everything from today as one simple total.' },
    { eyebrow: 'SIMPLE', headline: A('No tracking', 'every coffee.'), subtitle: "Just drop today's total and Spendaily does the rest." },
    // Privacy
    { eyebrow: 'PRIVACY', headline: A('No bank linking.', 'Ever.'), subtitle: 'Private by design — track spending without connecting an account.' },
    { eyebrow: 'PRIVATE', headline: A('Your budget,', 'not your data.'), subtitle: 'Spendaily never connects to your bank. It stays on your phone.' },
    { eyebrow: 'SECURE', headline: A('Budget privately.', 'For real.'), subtitle: 'Manual tracking, no bank logins — just you and your number.' },
    { eyebrow: 'PRIVACY', headline: A('No bank link.', 'No worries.'), subtitle: 'Track spending without sharing card details with anyone.' },
    // Impulse control
    { eyebrow: 'CONTROL', headline: A('Before you tap,', 'check this.'), subtitle: 'Your daily number is a speedometer for impulse buys.' },
    { eyebrow: 'CONTROL', headline: A('Less oops,', "more 'I planned that'."), subtitle: 'Daily limits turn impulse spending into conscious choices.' },
    // Couples
    { eyebrow: 'TOGETHER', headline: A('Money,', 'managed together.'), subtitle: 'Budget as a couple without a single argument about money.' },
    { eyebrow: 'COUPLES', headline: A('Two people,', 'one calm plan.'), subtitle: 'Share a budget or split expenses — calm for both of you.' },
    // Flexible / complete
    { eyebrow: 'FLEXIBLE', headline: A('Paid differently', 'every month?'), subtitle: 'Log each payment and your daily budget builds itself.' },
    { eyebrow: 'FREELANCE', headline: A('Irregular income,', 'steady spending.'), subtitle: 'Flexible Pay smooths variable pay into a daily allowance.' },
    { eyebrow: 'COMPLETE', headline: A('Your full picture,', 'one daily number.'), subtitle: 'Salary, bills and savings become your true daily budget.' },
    // Themes / brand
    { eyebrow: 'YOUR STYLE', headline: A('Same clarity.', 'Your personality.'), subtitle: 'Five palettes, light or dark, live backgrounds — yours.' },
    { eyebrow: 'DESIGN', headline: A('Budgeting that', 'feels good.'), subtitle: "Soft gradients, gentle motion and themes you'll want to open." },
    { eyebrow: 'SPENDAILY', headline: A('What if your budget', 'was one number?'), subtitle: "The calm way to know what's safe to spend, every day." },
    { eyebrow: 'CALM', headline: A('Money anxiety,', 'quietly gone.'), subtitle: "Trade the 'where did it go?' feeling for one daily number." },
    { eyebrow: 'START', headline: A('Free to start.', 'Calm by design.'), subtitle: 'Begin in seconds — no bank connection, no fuss.' },
    // Creative batch — punchy, playful, emotional
    { eyebrow: 'TODAY', headline: A('Wake up to', 'one good number.'), subtitle: 'Your safe-to-spend amount, ready before your coffee.' },
    { eyebrow: 'CALM', headline: A('Budgeting,', 'minus the dread.'), subtitle: 'No charts to decode — just today’s number.' },
    { eyebrow: 'SPEND', headline: A('Treat yourself,', 'on purpose.'), subtitle: 'Know it fits today before you buy it.' },
    { eyebrow: 'ROLLOVER', headline: A('Today’s no,', 'tomorrow’s yes.'), subtitle: 'Skip a spend now and unlock more room tomorrow.' },
    { eyebrow: 'GOALS', headline: A('Small saves,', 'big somedays.'), subtitle: 'Tiny daily wins add up to the trip you keep picturing.' },
    { eyebrow: 'STREAKS', headline: A('Keep the', 'green going.'), subtitle: 'Every under-budget day extends your streak.' },
    { eyebrow: 'PROOF', headline: A('You’ve got this.', 'The numbers agree.'), subtitle: 'Watch your good days stack up on the calendar.' },
    { eyebrow: 'PRIVACY', headline: A('Just you', 'and your number.'), subtitle: 'No bank logins, no third parties, no tracking.' },
    { eyebrow: 'SIMPLE', headline: A('Five seconds.', 'That’s the habit.'), subtitle: 'Drop today’s total and get on with your day.' },
    { eyebrow: 'PAYDAY', headline: A('Make it', 'to payday.'), subtitle: 'A daily limit that quietly keeps you in the green.' },
    { eyebrow: 'IMPULSE', headline: A('Pause the', 'panic buy.'), subtitle: 'One glance tells you if it fits today.' },
    { eyebrow: 'COUPLES', headline: A('Budget together,', 'argue never.'), subtitle: 'One shared number, two calm minds.' },
    { eyebrow: 'FLEXIBLE', headline: A('Gig income?', 'No problem.'), subtitle: 'Your daily allowance rebuilds itself as you get paid.' },
    { eyebrow: 'INSIGHTS', headline: A('Clarity,', 'not clutter.'), subtitle: 'The few numbers that actually matter, daily.' },
    { eyebrow: 'CATEGORIES', headline: A('Where it goes,', 'finally clear.'), subtitle: 'A clean donut, no spreadsheet required.' },
    { eyebrow: 'CALENDAR', headline: A('A month of', 'small wins.'), subtitle: 'Green days and gold stars, all in one view.' },
    { eyebrow: 'START', headline: A('Try it tonight,', 'feel calmer tomorrow.'), subtitle: 'Set one number and see your first daily limit.' },
    { eyebrow: 'CONTROL', headline: A('In control,', 'not in a spreadsheet.'), subtitle: 'Budgeting that fits your life, not the other way round.' },
    { eyebrow: 'SAVE', headline: A('Spend less,', 'live more.'), subtitle: 'Underspend today and route it to what you love.' },
    { eyebrow: 'DESIGN', headline: A('Finance that', 'feels like calm.'), subtitle: 'Soft colours, gentle motion, zero stress.' },
    { eyebrow: 'MONEY', headline: A('Know your day,', 'own your money.'), subtitle: 'One number keeps every spend intentional.' },
    { eyebrow: 'HABIT', headline: A('The five-second', 'money habit.'), subtitle: 'Log today’s total and stay effortlessly on track.' },
    { eyebrow: 'TRUST', headline: A('Private', 'on purpose.'), subtitle: 'Manual by design — your data never leaves your phone.' },
    { eyebrow: 'REWARD', headline: A('Turn restraint', 'into rewards.'), subtitle: 'Every skipped spend nudges a goal closer.' },
    { eyebrow: 'TODAY', headline: A('One glance.', 'Total clarity.'), subtitle: 'Open the app, see your number, carry on.' },
  ];

  const pills = [
    // Daily number
    { emoji: '💷', title: 'Daily limit', subtitle: '£108.34' },
    { emoji: '🟢', title: 'Safe to spend', subtitle: "today's number" },
    { emoji: '📅', title: 'Today', subtitle: 'one calm number' },
    { emoji: '⏰', title: 'Every morning', subtitle: 'a fresh number' },
    { emoji: '💡', title: 'Know your limit', subtitle: 'before you spend' },
    { emoji: '🛟', title: 'Spend safely', subtitle: 'never over' },
    // Rollover
    { emoji: '🔁', title: 'Smart Rollover', subtitle: 'set & forget' },
    { emoji: '🎉', title: '+£42.53', subtitle: 'to tomorrow' },
    { emoji: '🌙', title: 'Every midnight', subtitle: 'rolls automatically' },
    { emoji: '💜', title: 'Saved £31.03', subtitle: 'ready to route' },
    { emoji: '💵', title: '+£93.36', subtitle: 'rolled over' },
    { emoji: '📈', title: 'Carries forward', subtitle: 'never lost' },
    // Goals
    { emoji: '🎯', title: 'Goal progress', subtitle: '+2.4%' },
    { emoji: '✈️', title: 'Thailand trip', subtitle: '17% funded' },
    { emoji: '⌛', title: '6mo left', subtitle: 'ETA countdown' },
    { emoji: '👜', title: 'Bag · 100%', subtitle: 'goal purchased' },
    { emoji: '🏆', title: '1 achieved', subtitle: 'goals hit' },
    { emoji: '🎧', title: 'New headphones', subtitle: 'saving up' },
    { emoji: '🏝️', title: 'Dream trip', subtitle: 'funded daily' },
    { emoji: '🚀', title: 'Saving fast', subtitle: 'ahead of plan' },
    // Streaks / no-spend
    { emoji: '🔥', title: '4-day streak', subtitle: 'keep it going' },
    { emoji: '⭐', title: '7 no-spend days', subtitle: 'this month' },
    { emoji: '⚡', title: 'Streaks', subtitle: 'auto-protected' },
    { emoji: '✅', title: 'On track', subtitle: '4 days in a row' },
    { emoji: '🟩', title: '26 days under', subtitle: 'budget this month' },
    { emoji: '🥇', title: 'Best streak', subtitle: '12 days' },
    // Calendar
    { emoji: '📅', title: 'Payday cycles', subtitle: 'or calendar month' },
    { emoji: '🗓️', title: '£37.84', subtitle: 'daily average' },
    { emoji: '💚', title: '£832.47', subtitle: 'tracked this month' },
    // Insights
    { emoji: '💯', title: 'Budget score', subtitle: '90% this period' },
    { emoji: '🧠', title: 'Smart insights', subtitle: 'daily guidance' },
    { emoji: '📊', title: 'Projected saving', subtitle: '£67.53' },
    { emoji: '🧾', title: 'Month-end review', subtitle: 'what you saved' },
    // Categories
    { emoji: '📦', title: '8 categories', subtitle: 'auto-organised' },
    { emoji: '🚗', title: 'Transport · 13%', subtitle: '£105 this month' },
    { emoji: '🍴', title: 'Food · 12%', subtitle: '£100 this month' },
    { emoji: '🛒', title: 'Groceries', subtitle: '' },
    { emoji: '🛍️', title: 'Shopping', subtitle: '' },
    { emoji: '🍔', title: 'Food & Dining', subtitle: '' },
    { emoji: '☕', title: 'Coffee runs', subtitle: 'add up fast' },
    // Logging
    { emoji: '⏱️', title: 'Under 5 seconds', subtitle: 'quick add' },
    { emoji: '🧾', title: 'Daily total mode', subtitle: 'one tap, done' },
    { emoji: '👆', title: 'Three taps', subtitle: "and you're done" },
    { emoji: '📝', title: 'Log the total', subtitle: 'skip the receipts' },
    // Privacy
    { emoji: '🔒', title: 'No bank access', subtitle: 'private by design' },
    { emoji: '🛡️', title: 'No tracking', subtitle: 'your data stays yours' },
    { emoji: '✋', title: 'Manual control', subtitle: 'you own your data' },
    { emoji: '🔐', title: 'Private & secure', subtitle: 'nothing linked' },
    // Currency / languages
    { emoji: '🌍', title: '60+ currencies', subtitle: '14 languages' },
    { emoji: '🌐', title: '14 languages', subtitle: 'fully localised' },
    // Premium / free
    { emoji: '⭐', title: 'Free to start', subtitle: 'Premium optional' },
    { emoji: '💎', title: 'Premium', subtitle: 'save smarter' },
    { emoji: '🆓', title: 'Core is free', subtitle: 'forever' },
    { emoji: '🎁', title: '1-month trial', subtitle: 'cancel anytime' },
    // Couples / flexible
    { emoji: '💑', title: 'Couples budgeting', subtitle: 'one shared pot' },
    { emoji: '🤝', title: 'Split expenses', subtitle: 'no awkward maths' },
    { emoji: '📆', title: 'Flexible Pay', subtitle: 'any payday schedule' },
    { emoji: '💼', title: 'Variable income', subtitle: 'handled' },
    // Emotional / proof
    { emoji: '💛', title: 'Calm by design', subtitle: 'no money stress' },
    { emoji: '😌', title: 'Less anxiety', subtitle: 'more control' },
    { emoji: '🌟', title: 'Loved by budgeters', subtitle: '5 stars' },
    { emoji: '❤️', title: '"Feels like a game"', subtitle: '— Priya S.' },
    { emoji: '👍', title: 'Stay on track', subtitle: 'without the chore' },
    // Themes / misc
    { emoji: '🎨', title: '6 palettes', subtitle: 'light, dark & live' },
    { emoji: '🌗', title: 'Light & dark', subtitle: 'your choice' },
    { emoji: '🔔', title: 'Gentle reminders', subtitle: 'never naggy' },
    { emoji: '📲', title: 'Always with you', subtitle: 'budget in your pocket' },
  ];

  // Panorama gradients — one master gradient flowing across all screens. Tuned
  // so the hue clearly travels screen-to-screen while staying soft for text.
  const panoramas = [
    { name: 'Spendaily', colors: ['#C7B8F2', '#D9C2F0', '#EBC6E6', '#F3C9D6', '#F6CFC2', '#E9CBE6', '#CBC2F2'] },
    { name: 'Aurora', colors: ['#BFD0F5', '#C7C2F2', '#D8C2EE', '#EAC6E2', '#C9E3D6', '#BFD0F5'] },
    { name: 'Sunrise', colors: ['#FAD7B8', '#F8C9C2', '#F4C2D2', '#E6C2EC', '#CFC6F2', '#BFD0F5'] },
    { name: 'Candy Pop', colors: ['#F4C2DC', '#E3C2F0', '#C9C6F2', '#BFD9F2', '#C2EAE0', '#F4D9C2'] },
    { name: 'Lagoon', colors: ['#A9E0DE', '#B8D8F0', '#C7C9F0', '#D8C2EC', '#EAC6DE', '#F6CFC2'] },
    { name: 'Berry Bloom', colors: ['#C9B2E8', '#E0AEDC', '#F0AEC6', '#F6BBC0', '#F2C9C2', '#E6C2E6'] },
    { name: 'Peach Sorbet', colors: ['#FBD7C2', '#F9CFC9', '#F6C9D6', '#EFC9E2', '#DCC9F0', '#C9D2F2'] },
    { name: 'Mint Lilac', colors: ['#C2EBDD', '#CFE6E6', '#D9DCF0', '#E2CFEE', '#EFC9E2', '#F6CFD2'] },
    { name: 'Midnight', colors: ['#3A2A66', '#4A2A78', '#5A2A7C', '#43286B', '#2E2160', '#241A52'] },
    { name: 'Dusk', colors: ['#5B4B8A', '#7A5A9E', '#9A5A95', '#B0628A', '#8A5A9E', '#5B4B8A'] },
  ];

  window.BRAND_CONTENT.spendaily = { textSets, pills, panoramas };
})();

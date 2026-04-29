/**
 * Shared ad text presets used by both App and Social editors.
 * Each preset includes hero, subtext, and a screenshot note for quick matching.
 */

window.AdTextPresets = (() => {
  'use strict';

  const items = [
    {
      number: 1,
      category: 'Screenshot extracted',
      hero: 'Private and secure.',
      subtext: 'No bank connection needed.',
      screenshotNote: 'Login or onboarding privacy screen with provider buttons.',
    },
    {
      number: 2,
      category: 'Screenshot extracted',
      hero: 'Every day has a plan.',
      subtext: 'Record your no-spend days.',
      screenshotNote: 'Daily detail modal over calendar with no-spend action visible.',
    },
    {
      number: 3,
      category: 'Screenshot extracted',
      hero: 'Add spending in seconds.',
      subtext: 'Fast categories, zero friction. Add as a daily total.',
      screenshotNote: 'Add expense sheet with category chips and Add as Daily Total card.',
    },
    {
      number: 4,
      category: 'Screenshot extracted',
      hero: 'Save for what you want.',
      subtext: 'Every spare pound moves a goal forward.',
      screenshotNote: 'Goals screen with progress cards and active goals list.',
    },
    {
      number: 5,
      category: 'Screenshot extracted',
      hero: 'See if you\'re on track.',
      subtext: 'Know what\'s left before payday.',
      screenshotNote: 'Summary analytics screen with budget ring and category chart.',
    },
    {
      number: 6,
      category: 'Screenshot extracted',
      hero: 'Your month at a glance.',
      subtext: 'Spot overspending before it snowballs.',
      screenshotNote: 'Monthly calendar overview with under/on-track/over day colors.',
    },
    {
      number: 7,
      category: 'Screenshot extracted',
      hero: 'Unspent money keeps working.',
      subtext: 'Roll it over or move it to goals.',
      screenshotNote: 'Rollover decision sheet with roll to tomorrow and invest in goals actions.',
    },
    {
      number: 8,
      category: 'Screenshot extracted',
      hero: 'Know today\'s limit.',
      subtext: 'Stop guessing what you can spend today.',
      screenshotNote: 'Home screen with daily allowance card and today\'s expenses section.',
    },
    {
      number: 9,
      category: 'Privacy / no-bank-link angles',
      hero: 'Budget privately. For real.',
      subtext: 'Manual tracking, no bank logins, just you and your daily number.',
      screenshotNote: 'Login or onboarding screen highlighting privacy and no bank connection.',
    },
    {
      number: 10,
      category: 'Privacy / no-bank-link angles',
      hero: 'No bank link. No worries.',
      subtext: 'Track spending without sharing banking data or card details with anyone.',
      screenshotNote: 'Login screen or FAQ/privacy style screen.',
    },
    {
      number: 11,
      category: 'Privacy / no-bank-link angles',
      hero: 'Your budget, not your data.',
      subtext: 'Spendaily never connects to your bank - everything stays between you and your phone.',
      screenshotNote: 'Login screen or Settings > Privacy section.',
    },
    {
      number: 12,
      category: 'Daily number clarity',
      hero: 'One number. Every day.',
      subtext: 'See exactly what you can spend today before you tap your card.',
      screenshotNote: 'Home screen with Today you can spend up to amount visible.',
    },
    {
      number: 13,
      category: 'Daily number clarity',
      hero: 'Stop guessing today\'s budget.',
      subtext: 'Your daily allowance updates automatically after every expense you log.',
      screenshotNote: 'Home screen with a few expenses logged so progress movement is visible.',
    },
    {
      number: 14,
      category: 'Daily number clarity',
      hero: 'Can I afford this today?',
      subtext: 'Open Spendaily, check one number, and spend without second-guessing.',
      screenshotNote: 'Home screen with today\'s limit prominent.',
    },
    {
      number: 15,
      category: 'Rollover as a reward',
      hero: 'Yesterday\'s willpower, today\'s bonus.',
      subtext: 'Underspend and your leftover rolls straight into tomorrow or your goals.',
      screenshotNote: 'Rollover decision modal with Roll to tomorrow or Invest in goals.',
    },
    {
      number: 16,
      category: 'Rollover as a reward',
      hero: 'Skipped the takeaway? Get the glow-up.',
      subtext: 'Every unspent pound rolls over or nudges a savings goal closer.',
      screenshotNote: 'Rollover modal or Goals screen showing progress jump.',
    },
    {
      number: 17,
      category: 'Rollover as a reward',
      hero: 'Unspent money keeps working.',
      subtext: 'Roll it to tomorrow or move it to something you\'re saving for - you choose every day.',
      screenshotNote: 'Rollover modal or existing Unspent money keeps working screen.',
    },
    {
      number: 18,
      category: 'Goals and emotional wins',
      hero: 'Turn one day into a date.',
      subtext: 'Name your goal, set a target, and watch the progress ring fill with every good day.',
      screenshotNote: 'Goals screen with multiple goals and visible progress rings.',
    },
    {
      number: 19,
      category: 'Goals and emotional wins',
      hero: 'From I\'m broke to I\'m saving.',
      subtext: 'Daily micro-savings stack into real things: trips, tech, and treats.',
      screenshotNote: 'Goals screen with a goal close to 100 percent.',
    },
    {
      number: 20,
      category: 'Goals and emotional wins',
      hero: 'Every yes has a why.',
      subtext: 'Tie your daily spending to goals that actually matter, not a vague savings pot.',
      screenshotNote: 'Goal details card with emoji or image and target amount.',
    },
    {
      number: 21,
      category: 'Calendar, streaks and no-spend days',
      hero: 'Money habits, in colour.',
      subtext: 'Green days, gold stars and a calendar that actually motivates you to stay on track.',
      screenshotNote: 'Calendar with under/on-track/over colours and no-spend stars.',
    },
    {
      number: 22,
      category: 'Calendar, streaks and no-spend days',
      hero: 'See your month, not your mess.',
      subtext: 'Spot overspending before it snowballs with a simple colour-coded calendar.',
      screenshotNote: 'Calendar with a mix of green, yellow and red days.',
    },
    {
      number: 23,
      category: 'Calendar, streaks and no-spend days',
      hero: 'No-spend days, but make it fun.',
      subtext: 'Lock in streaks and star badges instead of guilt when you skip a spend.',
      screenshotNote: 'Calendar or Summary screen where no-spend streaks and badges are visible.',
    },
    {
      number: 24,
      category: 'Impulse-spend control',
      hero: 'Before you tap, check this.',
      subtext: 'Your daily number acts like a speedometer for impulse buys.',
      screenshotNote: 'Home with today\'s allowance and Spent today clearly visible.',
    },
    {
      number: 25,
      category: 'Impulse-spend control',
      hero: 'The do I buy it answer.',
      subtext: 'One glance at Spendaily tells you if that purchase actually fits today.',
      screenshotNote: 'Home screen, optionally with a slight phone tilt for motion.',
    },
    {
      number: 26,
      category: 'Impulse-spend control',
      hero: 'Less oops, more I planned that.',
      subtext: 'Daily limits and rollovers turn impulse spending into conscious choices.',
      screenshotNote: 'Combination shot: Home plus Summary.',
    },
    {
      number: 27,
      category: 'Ease and speed of logging',
      hero: 'Log spending in three taps.',
      subtext: 'Fast categories and daily total mode keep tracking under 10 seconds.',
      screenshotNote: 'Add expense modal with categories and Add as daily total visible.',
    },
    {
      number: 28,
      category: 'Ease and speed of logging',
      hero: 'Spent without tracking? Fix it fast.',
      subtext: 'Add everything from today as one simple total when you get home.',
      screenshotNote: 'Add expense with Add as Daily Total highlighted.',
    },
    {
      number: 29,
      category: 'Ease and speed of logging',
      hero: 'Budgeting that fits in a queue.',
      subtext: 'Open the app, log the amount, close it before your coffee is ready.',
      screenshotNote: 'Add expense screen, cropped tighter for clarity.',
    },
    {
      number: 30,
      category: 'Being on track for payday',
      hero: 'Am I okay for payday?',
      subtext: 'Summary cards show how much is left for the month in seconds, not spreadsheets.',
      screenshotNote: 'Summary or analytics with left this month and charts visible.',
    },
    {
      number: 31,
      category: 'Being on track for payday',
      hero: 'On track or drifting?',
      subtext: 'Your budget score, streaks and charts give a clear yes or no, not a wall of numbers.',
      screenshotNote: 'Summary screen showing budget score and streaks.',
    },
    {
      number: 32,
      category: 'Being on track for payday',
      hero: 'End the month with money left.',
      subtext: 'Daily limits and rollovers keep you out of end-of-month panic.',
      screenshotNote: 'Home plus Calendar or Home plus Summary combo.',
    },
  ];

  return {
    items,
    getByNumber(number) {
      return items.find((item) => item.number === number) || null;
    },
  };
})();

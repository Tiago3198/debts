export function parseDebt(text) {
  const normalized = text.toLowerCase().trim();

  // Step 1 — Prioritize number WITH unit, fallback to largest number
  const amountWithUnitRegex = /(\d+)\s*(mill[oó]nes?|mil|k)\b/i;
  const amountWithUnit = normalized.match(amountWithUnitRegex);

  let amount = 0;
  let amountRegex;

  if (amountWithUnit) {
    const num = parseFloat(amountWithUnit[1]);
    const unit = amountWithUnit[2].toLowerCase();
    if (unit.startsWith('mill')) amount = num * 1000000;
    else if (unit === 'mil' || unit === 'k') amount = num * 1000;
    amountRegex = amountWithUnitRegex;
} else {
  // No unit found — take the largest number
  const allNumbers = [...normalized.matchAll(/(\d+)/g)];
  if (allNumbers.length > 0) {
    const largest = allNumbers.reduce((a, b) =>
      parseFloat(a[1]) > parseFloat(b[1]) ? a : b
    );
    amount = parseFloat(largest[1]);
    amountRegex = new RegExp(`\\b${largest[1]}\\b`); // elimina el número exacto
  }
}

  // Step 2 — Remove amount from text
  const withoutAmount = amountRegex
    ? normalized.replace(amountRegex, ' ')
    : normalized;

  // Step 3 — Remove filler words
  const fillers = [
    'me quedó debiendo',
    'tiene una deuda conmigo de',
    'tiene pendiente conmigo',
    'tiene pendiente',
    'me adeuda',
    'me debe',
    'conmigo',
    'debiendo',
    'pendiente',
    'deuda',
    'por',
    'de',
    'en',
    '--',
    '—',
  ];
  let cleaned = withoutAmount;
  fillers.forEach(f => {
    cleaned = cleaned.replace(new RegExp(`\\b${f}\\b`, 'gi'), ' ');
  });
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Step 4 — First word = person, rest = note
  const words = cleaned.split(' ').filter(w => w.length > 1);
  const person = words[0] || '';
  const note = words.slice(1).join(' ') || '';

  const MAX_AMOUNT = 1_000_000_000;
  const errors = [];
  if (!person) errors.push('person');
  if (!amount) errors.push('amount');
  if (amount > MAX_AMOUNT) errors.push('amount_limit');

  return {
    person: person ? person.charAt(0).toUpperCase() + person.slice(1) : '',
    amount,
    note,
    errors,
  };
}
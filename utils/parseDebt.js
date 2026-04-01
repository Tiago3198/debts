export function parseDebt(text) {
  const normalized = text.toLowerCase().trim();

  // Step 1 — Extract and normalize amount
  const amountRegex = /(\d+)\s*(mill[oó]n|mil|k)?/i;
  const amountMatch = normalized.match(amountRegex);
  let amount = 0;
  if (amountMatch) {
    const num = parseFloat(amountMatch[1]);
    const unit = (amountMatch[2] || '').toLowerCase();
    if (unit.includes('mill')) amount = num * 1000000;
    else if (unit === 'mil' || unit === 'k') amount = num * 1000;
    else amount = num;
  }
  
  const MAX_AMOUNT = 1_000_000_000;

  if (amount > MAX_AMOUNT) {
    return { person: '', amount: 0, note: '', errors: ['amount_limit'] };
  }

  // Step 2 — Remove amount from text
  const withoutAmount = normalized.replace(amountRegex, ' ');

  // Step 3 — Remove filler words and phrases
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

  const errors = [];
  if (!person) errors.push('person');
  if (!amount) errors.push('amount');

  return {
    person: person ? person.charAt(0).toUpperCase() + person.slice(1) : '',
    amount,
    note,
    errors,
  };
}
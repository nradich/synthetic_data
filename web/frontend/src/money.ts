const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Parses API money strings (e.g. "$25.99", "25.99") to a finite number. */
export function parseMoney(value: string | number | undefined | null): number {
  if (value == null || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const cleaned = String(value).replace(/[^0-9.-]/g, '').trim()
  if (cleaned === '' || cleaned === '-') return 0
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

/** Formats a numeric or string amount as USD. */
export function formatMoney(value: string | number | undefined | null): string {
  return currency.format(parseMoney(value))
}

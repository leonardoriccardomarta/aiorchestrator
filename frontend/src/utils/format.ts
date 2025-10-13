export const formatCurrency = (amount: number, locale = 'en-US', currency = 'USD') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-GB');

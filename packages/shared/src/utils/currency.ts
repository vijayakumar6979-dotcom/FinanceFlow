export const currencies = [
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
];

export function formatCurrency(amount: number, currencyCode: string = 'MYR'): string {
    const currency = currencies.find(c => c.code === currencyCode) || currencies[0];

    // Handle Japanese Yen and other 0 dimension currencies if needed, though standard formatter handles most
    const minimumFractionDigits = ['JPY'].includes(currencyCode) ? 0 : 2;
    const maximumFractionDigits = ['JPY'].includes(currencyCode) ? 0 : 2;

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(amount);

    return `${currency.symbol} ${formattedAmount}`;
}

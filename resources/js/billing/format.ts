export function formatAED(n: number | string | null | undefined): string {
    if (n == null || n === '' || isNaN(Number(n))) return 'AED 0.00';
    return (
        'AED ' +
        Number(n).toLocaleString('en-AE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
}

export function formatAEDShort(n: number | string | null | undefined): string {
    if (n == null || n === '' || isNaN(Number(n))) return 'AED 0';
    return 'AED ' + Number(n).toLocaleString('en-AE', { maximumFractionDigits: 0 });
}

export function formatDate(iso?: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function daysUntil(iso?: string | null): number {
    if (!iso) return 0;
    const d = new Date(iso);
    const now = new Date();
    return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

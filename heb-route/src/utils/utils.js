/**
 * Truncates text to n charaters
 */
export const truncate = (s, n) => {
    return s.length > n ? s.substring(0, n) + '...' : s;
};

/**
 * Displays curreny
 */
export const currency = (n) => {
    const ans = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(n);
    return ans;
};

/**
 * Delay in (ms)
 */
export const delay = ms => new Promise(res => setTimeout(res, ms));
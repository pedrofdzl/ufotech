/**
 * Truncates text to n charaters
 */
export const truncate = (s, n) => {
    return s.length > n ? s.substring(0, n) + '...' : s;
};
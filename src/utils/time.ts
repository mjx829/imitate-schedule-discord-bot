export const toHHMM = (date: Date): string => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

export const toYYYYMMDD = (date: Date): string => {
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, ' ');
    const dd = String(date.getDate()).padStart(2, ' ');
    return `${yyyy}/${mm}/${dd}`;
}

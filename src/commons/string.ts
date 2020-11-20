export const sentenceCase = (str?: string) => {
    return str && str.replace(/^\w/, (c) => c.toUpperCase());
};

export function nameToLabel(field: string) {
    if (!field) {
        return '';
    }
    const t = sentenceCase(field);
    const arr = t.match(/[A-Z][a-z]*|[0-9]+/g) ?? [];
    return arr.join(' ');
}

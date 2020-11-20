export function isInvalidDate(value) {
    return value instanceof Date && isNaN(value.getTime());
}

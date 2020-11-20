export function debounce(func: () => void, delayInMilliseconds: number, immediate?: boolean) {
    let timeout, result;

    const debounced = function () {
        // @ts-ignore
        const context = this;
        const args = arguments;
        if (timeout) clearTimeout(timeout);

        const later = function () {
            timeout = null;
            // @ts-ignore
            if (!immediate) result = func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        timeout = setTimeout(later, delayInMilliseconds);
        // @ts-ignore
        if (callNow) result = func.apply(this, args);

        return result;
    };
    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
}

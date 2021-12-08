export const defaultValues = {
    ARRAY: [],
    OBJECT: {},
    FUNCTION: () => {}
}

export function isObject(val) {
    return val !== null && typeof val !== 'function' && typeof val === 'object' && !Array.isArray(val);
}
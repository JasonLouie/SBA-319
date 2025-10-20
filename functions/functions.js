/**
 * Function that creates an error object
 * @param {string | object} msg 
 * @param {number} status 
 * @returns {object}
 */
export function error(msg, status=400) {
    return { message: msg, status: status, custom: true };
}

export function validateLimit(limit) {
    if (!limit) {
        return 25;
    } else if (limit && isNaN(limit)) {
        throw error("Limit provided is not a number");
    } else if (!Number.isInteger(Number(limit)) || limit < 1) {
        throw error("Limit provided must be a positive integer");
    }
    return Number(limit) > 25 ? 25 : Number(limit);
}
/**
 * Validates an object by checking if there are any keys that should not exist
 * @param {{Any}} obj 
 * @param {[String]} keys 
 * @param {boolean} fullMatch
 * @returns {boolean}
 */
export function validateObject(obj, keys, fullMatch = false, optionalKeys = []) {
    for (const key in obj) {
        if (!keys.includes(key) && (optionalKeys.length > 0 && !optionalKeys.includes(key))) {
            throw error("Invalid body. Extra fields detected.");
        }
    }
    const numKeys = Object.keys(obj).length;
    return fullMatch ? (numKeys >= keys.length && numKeys <= keys.length + optionalKeys.length) : numKeys > 0;
}
export function handleError(err) {
    if (err.name === "ValidationError") {
        const messages = {};
        for (const key in err.errors) {
            messages[key] = err.errors[key].message;
        }
        return {errors: messages};
    } else if (err.name === "CastError") {
        const messages = {};
        messages[err.path] = err.message;
        return {errors: messages};
    } else if (err.code && err.code === 11000) { // If validator fails to catch a uniqueness error from the validator, expect a MongoDB error
        const field = Object.keys(err.keyValue)[0];
        return error(`${field[0].toUpperCase() + field.slice(1)} is taken`);
    } else if (err.error) { // Custom error thrown
        return err;
    }
    return err.message;
}

export function error(msg) {
    return { error: msg };
}

export function validateLimit(limit) {
    if (!limit) {
        return 25;
    } else if (limit && isNaN(limit)) {
        throw error("Limit provided is not a number");
    } else if (!Number.isInteger(Number(limit)) || limit < 1) {
        throw error("Limit provided must be a positive integer");
    }
    return Number(limit);
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
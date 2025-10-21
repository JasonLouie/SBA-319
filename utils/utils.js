/**
 * Function that creates an error object
 * @param {string | object} msg 
 * @param {number} status 
 * @returns {object}
 */
export function error(msg, status = 400) {
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

// Only for the demo
export function cleanseAnimeBody(req, res, next) {
    // Cleanse genres by taking the string of genres separated by commas, cleanses it (removes whitespace), and returns the array of genres
    if (req.body.genres && typeof req.body.genres === "string") {
        const genresArray = req.body.genres.split(",").map(ch => ch.trim()).filter(ch => ch.length > 0);
        req.body.genres = genresArray;
    }

    if (req.body.episodes && typeof req.body.episodes === "string") {
        req.body.episodes = Number(req.body.episodes);
    }

    if (req.body.premiered && typeof req.body.premiered === "string") {
        req.body.premiered = Number(req.body.premiered);
    }

    if (req.method === "PATCH" && req.body._id) {
        req.body._id = undefined; // Unset this key to prevent error from being thrown and prevent modifying the field
    }

    next();
}

// Only for the demo
export function cleanseUserBody(req, res, next) {
    if (req.body.username) {
        req.body.username = undefined; // Unset this key to prevent error from being thrown and prevent modifying the field
    }
    next();
}

// Only for the demo
export function cleanseReviewBody(req, res, next) {
    if (req.body.anime_id) {
        req.body.anime_id = Number(req.body.anime_id);
    }

    if (req.body.rating) {
        req.body.rating = Number(req.body.rating);
    }

    if (req.method === "PATCH") {
        const forbiddenKeys = ["_id", "anime_id", "user_id", "title", "username"];
        forbiddenKeys.forEach(key => {
            if (req.body[key] != undefined) { // Unset this key to prevent error from being thrown and prevent modifying the field
                req.body[key] = undefined;
            }
        })
    }
    next();
}

export const timeOptions = { hour12: true, hour: "numeric", minute: "2-digit" };
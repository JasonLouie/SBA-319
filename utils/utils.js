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
 * Takes the string of genres separated by commas, cleanses it (removes whitespace), and returns the array of genres
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function cleanseAnimeBody(req, res, next) {
    // Cleanse genres
    if (req.body.genres && typeof req.body.genres === "string"){
        const genresArray = req.body.genres.split(",").map(ch => ch.trim()).filter(ch => ch.length > 0);
        req.body.genres = genresArray;
    }

    if (req.body.episodes && typeof req.body.episodes === "string"){
        req.body.episodes = Number(req.body.episodes);
    }

    if (req.body.premiered && typeof req.body.premiered === "string"){
        req.body.premiered = Number(req.body.premiered);
    }
    next();
}

export function cleanseModifyUserBody(req, res, next) {
    if (req.body.username) {
        req.body.username = undefined; // Unset this key to prevent error from being thrown
    }
    next();
}

export function cleanseReviewBody(req, res, next) {
    if (req.body.anime_id) {
        req.body.anime_id = Number(req.body.anime_id);
    }

    if (req.body.rating) {
        req.body.rating = Number(req.body.rating);
    }
    next();
}
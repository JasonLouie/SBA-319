import resetDatabase from "../../services/resetService.js";

export default async function resetDB(req, res, next) {
    try {
        await resetDatabase();
        const backUrl = req.header("Referer") || "/";
        res.redirect(backUrl);
    } catch (err) {
        next(err)
    }
}
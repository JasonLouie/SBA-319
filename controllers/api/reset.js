import resetDatabase from "../../services/resetService.js";

export default async function resetDB(req, res, next) {
    try {
        const message = await resetDatabase();
        res.json({message: message});
    } catch (err) {
        next(err)
    }
}
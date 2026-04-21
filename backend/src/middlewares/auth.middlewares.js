import jwt from "jsonwebtoken";
import Users from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";

const verifytoken = async (req, res, next) => {
    try {
        const authHeader = req.get("authorization");
        let token = null;

        if (authHeader && /^Bearer\s+/i.test(authHeader)) {
            token = authHeader.replace(/^Bearer\s+/i, "").trim();
        } else if (req.headers["x-access-token"]) {
            token = String(req.headers["x-access-token"]).trim();
        } else if (req.headers.token) {
            token = String(req.headers.token).trim();
        }

        if (!token) {
            return next(new apierror(401, "Not authorized, no token"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findById(decoded.id).select("-password");

        if (!user) {
            return next(new apierror(404, "User not found"));
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
};
export default verifytoken;

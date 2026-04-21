import jwt from "jsonwebtoken";
import Users from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";

const verifytoken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new apierror(401, "Not authorized, no token"));
        }

        const token = authHeader.split(" ")[1];

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

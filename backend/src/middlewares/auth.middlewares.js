import jwt from "jsonwebtoken";
import Users from "../models/user.models.js";
import { apierror } from "../utils/apierror.js";

const verifytoken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new apierror("Not authorized, no token", 401));
        }

        const token = authHeader.split(" ")[1];
        console.log("TOKEN:", token);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);


        const user = await Users.findById(decoded.id).select("-password");

        if (!user) {
            return next(new apierror("User not found", 404));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("VERIFY TOKEN ERROR:", error);
        console.log(error.name);
        console.log(error.message);

        if (error.name === "TokenExpiredError") {
            return next(new apierror("Token expired", 401));
        }

        if (error.name === "JsonWebTokenError") {
            return next(new apierror("Invalid token", 401));
        }

        next(error);
    }
};
export default verifytoken;
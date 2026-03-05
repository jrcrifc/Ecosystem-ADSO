import jwt from "jsonwebtoken";


export default async function authMiddleware(req, res, next) {

    try {
        const autMeader = req.get("Authorization");

        if (!autMeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const parts = autMeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ messege: "Invalid authorization format"})
        }

        const token = parts[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        return next();
    } catch (err) {
        return res.status(401).json({ message: "token invalido o expirado" });

    }
}
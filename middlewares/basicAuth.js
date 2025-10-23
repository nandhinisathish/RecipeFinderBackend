import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ errors: [{ msg: "No Token, Auth Denied" }] });

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ errors: [{ msg: "Authentication Failed" }] });
  }
}

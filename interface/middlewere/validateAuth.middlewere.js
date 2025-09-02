import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), "../.env"),
});

export const validateAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = `Bearer ${process.env.IMPORT_TOKEN}`;

  if (!authHeader || authHeader !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

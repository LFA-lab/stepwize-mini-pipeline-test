import express from "express";
import { health } from "../controllers/health.controllers.js";

const healthRouter = express.Router();

healthRouter.get("/", health);

export default healthRouter;

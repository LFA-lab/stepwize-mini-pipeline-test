import express from "express";
import { getGuide } from "../controllers/callback.controllers.js";

const guideRouter = express.Router();

guideRouter.get("/:id", getGuide);

export default guideRouter;

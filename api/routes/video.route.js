import express from "express";
import { processVideo } from "../controllers/video.controllers.js";
import { validateAuth } from "../middlewere/validateAuth.middlewere.js";

const videoRouter = express.Router();

videoRouter.post("/process-video", validateAuth, processVideo);

export default videoRouter;

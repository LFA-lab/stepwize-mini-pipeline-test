import express from "express";
import { receiveSteps, getGuide } from "../controllers/callback.controllers.js";

const callbackRouter = express.Router();

callbackRouter.post("/steps", receiveSteps);
callbackRouter.get("/guides/:id", getGuide);

export default callbackRouter;

import express from "express";
import healthRouter from "./routes/health.route.js";
import videoRouter from "./routes/video.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var port = 8000;

app.get("/", (req, res) => {
  res.send("Welcome to API Port");
});

app.use("/health", healthRouter);
app.use("/", videoRouter);

app.listen(port, () => {
  console.log(`Connected to ${port}`);
});

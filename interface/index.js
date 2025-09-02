import express from "express";
import path from "path";
import healthRouter from "./routes/health.route.js";
import callbackRouter from "./routes/callback.route.js";
import guideRouter from "./routes/guides.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "templates"));

var port = 4000;

app.get("/", (req, res) => {
  res.send("Welcome to Inference Port");
});

app.use("/health", healthRouter);
app.use("/callbacks", callbackRouter);
app.use("/guides", guideRouter);

app.listen(port, () => {
  console.log(`Connected to ${port}`);
});

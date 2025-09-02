import fs from "fs";
import path from "path";

const RECEIVED_FILE_PATH = path.join(process.cwd(), "received.json");

export const receiveSteps = async (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(RECEIVED_FILE_PATH, JSON.stringify(data, null, 2));

    res.json({
      status: "received",
    });
  } catch (error) {
    console.error("Error saving callback data:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getGuide = async (req, res) => {
  try {
    const guideId = parseInt(req.params.id);

    if (!fs.existsSync(RECEIVED_FILE_PATH)) {
      return res.status(404).json({ error: "No data received yet" });
    }

    const fileContent = fs.readFileSync(RECEIVED_FILE_PATH, "utf8");
    const data = JSON.parse(fileContent);

    if (data.guide_id !== guideId) {
      return res.status(404).json({ error: "Guide not found" });
    }

    res.render("guide", {
      guide_id: data.guide_id,
      steps: data.steps,
    });
  } catch (error) {
    console.error("Error loading guide:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

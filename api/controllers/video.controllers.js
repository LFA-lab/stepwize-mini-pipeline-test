import axios from "axios";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
    ];

    const allowedExtensions = [".mp4", ".avi", ".mov", ".wmv", ".mpeg"];

    if (
      allowedMimeTypes.includes(file.mimetype) ||
      allowedExtensions.some((ext) =>
        file.originalname.toLowerCase().endsWith(ext)
      )
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
});

const sendCallback = async (callback_url, data) => {
  try {
    await axios.post(callback_url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Callback failed:", error.message);
  }
};

export const processVideo = (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      let guide_id, callback_url, video_source;

      if (req.file || req.body.file) {
        guide_id = req.body.guide_id;
        callback_url = req.body.callback_url;
        video_source = "file_upload";

        if (!req.file && !req.body.file) {
          return res.status(422).json({ error: "Invalid input" });
        }
      } else {
        const { video_url, guide_id: gid, callback_url: curl } = req.body;
        guide_id = gid;
        callback_url = curl;
        video_source = video_url;

        if (!video_url) {
          return res.status(422).json({ error: "Invalid input" });
        }
      }

      if (!guide_id || !callback_url || isNaN(Number(guide_id))) {
        return res.status(422).json({ error: "Invalid input" });
      }

      // I have used a custom url because the given url (http://example.com/img1.jpg) is not working right now.

      const generateMockResponse = (guide_id) => {
        return {
          guide_id: Number(guide_id),
          steps: [
            {
              index: 1,
              second: 5,
              title: "Frame 00:05",
              image_url:
                "https://imgs.search.brave.com/cH6li72M0jB5ym5bc0M-KY_GgdTjDweUmef_Q4jsYfM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzQxNjkyMDg1MDct/ODQzNzYxNDQ4NDhi/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1UQjhmR2x0/WVdkbGZHVnVmREI4/ZkRCOGZId3c",
            },
            {
              index: 2,
              second: 10,
              title: "Frame 00:10",
              image_url:
                "https://imgs.search.brave.com/yJTb_DK2XUlYpSsn3NPcMaBvZw_8VQCrkZVAU8kEtbk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vcGljanVt/Ym8uY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9saXF1aWQtZ2xv/c3N5LWlyaWRlc2Nl/bnQtYWJzdHJhY3Qt/YmFja2dyb3VuZC1m/cmVlLWltYWdlLmpw/ZWc_dz02MDAmcXVh/bGl0eT04MA",
            },
            {
              index: 3,
              second: 15,
              title: "Frame 00:15",
              image_url:
                "https://imgs.search.brave.com/NvzUeB8KzH71H_wDULmdJT9l-Oe8Vn0uI16QwwyqhcQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjIx/NjQ4MTYxNy9waG90/by9haS1jb2Rpbmct/YXNzaXN0YW50LWlu/dGVyZmFjZS13aXRo/LXZpYmUtY29kaW5n/LWFlc3RoZXRpY3Mu/d2VicD9hPTEmYj0x/JnM9NjEyeDYxMiZ3/PTAmaz0yMCZjPWR2/OG1XeExTTFo0bm1f/QWQ5VXpLSG1jRmVu/TzFYSUpLMmMweWhG/WTYzMms9",
            },
          ],
        };
      };

      const mockResponse = generateMockResponse(guide_id);

      sendCallback(callback_url, mockResponse);

      res.json(mockResponse);
    } catch (error) {
      console.error("Processing video error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

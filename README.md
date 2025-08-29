# Stepwize Technical Test — Mini Local Pipeline

## Context
This test is designed to evaluate your ability to:
- Build a simple API that accepts a video (via file upload or URL).
- Implement a separate callback service.
- Make two independent services communicate in a pipeline.
- Provide a minimal web interface to display the results.
- Document your work clearly and make it reproducible.

---

## Objective
Within this repository, you must create **two separate services**:

1. **API (port 8000)**
   - Endpoint `GET /health` → must return `{ "ok": true }`
   - Endpoint `POST /process-video`:
     - Validate header: `Authorization: Bearer stepwize_test`
       - → return **401** if missing or invalid
     - Must accept two modes:
       - **File upload** (`multipart/form-data`)
       - **Remote URL** (JSON body)
     - Validate inputs
       - → return **422** if invalid
     - Always return **3 mocked steps** in JSON:
       ```json
       {
         "guide_id": 67,
         "steps": [
           { "index": 1, "second": 5, "title": "Frame 00:05", "image_url": "http://example.com/img1.jpg" },
           { "index": 2, "second": 10, "title": "Frame 00:10", "image_url": "http://example.com/img2.jpg" },
           { "index": 3, "second": 15, "title": "Frame 00:15", "image_url": "http://example.com/img3.jpg" }
         ]
       }
       ```
     - Must also send the same JSON to the provided `callback_url`.

2. **Interface (port 4000)**
   - Endpoint `GET /health` → must return `{ "ok": true }`
   - Endpoint `POST /callbacks/steps`
     - Receive the JSON sent by the API
     - Save it into `received.json`
   - Endpoint `GET /guides/:id`
     - Load `received.json`
     - Render an HTML page listing the steps (title + image)
     - Apply simple, clean CSS (list or grid)

---

## Technical Requirements
- Both services must live in **separate folders** inside this repository.
- Provide a `.env.example` file containing:
  ```env
  IMPORT_TOKEN=stepwize_test
````

* Provide a `docker-compose.yml` file to start both services together:

  * API → [http://localhost:8000](http://localhost:8000)
  * Interface → [http://localhost:4000](http://localhost:4000)

---

## Expected Verification

1. Start services:

   ```bash
   docker compose up --build
   ```

2. Check health:

   ```bash
   curl http://localhost:8000/health
   curl http://localhost:4000/health
   ```

3. Trigger the pipeline (file upload example):

   ```bash
   curl -X POST http://localhost:8000/process-video \
     -H "Authorization: Bearer stepwize_test" \
     -F "file=@/path/to/video.mp4" \
     -F "guide_id=67" \
     -F "callback_url=http://callback:4000/callbacks/steps"
   ```

   Or using remote URL:

   ```bash
   curl -X POST http://localhost:8000/process-video \
     -H "Authorization: Bearer stepwize_test" \
     -H "Content-Type: application/json" \
     -d '{"video_url":"https://example.com/video.mp4","guide_id":67,"callback_url":"http://callback:4000/callbacks/steps"}'
   ```

4. Expected result:

   * `received.json` must be created in the interface service
   * Visit [http://localhost:4000/guides/67](http://localhost:4000/guides/67)
     → The page must display the 3 mocked steps (titles + images)

---

## Grading (100 points)

* Token validation and input checks (401/422): 25
* Both modes working (file upload + URL): 25
* Callback JSON received and stored: 20
* HTML page displays the steps: 20
* Clear documentation (README with setup & tests): 10

Passing score: **≥ 75 points**

---

## Delivery

* Work directly in this repository
* Create a branch: `candidate/<your_name>`
* Open a Pull Request to `main` including:

  * Source code for both services
  * `docker-compose.yml`, `.env.example`
  * Updated README with instructions and screenshots

Additional Requirement — Screen Recording

You must also **record your screen** (MP4 format) to demonstrate the full workflow.  
This video must show:

1. Starting the services with `docker compose up --build`
2. Checking both health endpoints (`/health`)
3. Uploading a video file through the API
4. The API returning mocked steps and sending them to the callback
5. The Interface saving the steps in `received.json`
6. Opening `http://localhost:4000/guides/67` and showing the 3 mocked steps displayed on the web page

The video file (MP4) must then be **sent to Tarun** as proof of your workflow.

Estimated time: **3–4 hours**


# Docker Setup Instructions

## Quick Start with Docker Compose

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

2. **Run in background:**

   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**

   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f api
   docker-compose logs -f inference
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

## Test the Dockerized Services

After running `docker-compose up`, test the endpoints:

**Health checks:**

- API: http://localhost:8000/health
- Inference: http://localhost:4000/health

**Video processing (JSON):**

```bash
curl -X POST http://localhost:8000/process-video \
  -H "Authorization: Bearer stepwize_test" \
  -H "Content-Type: application/json" \
  -d '{"video_url":"https://example.com/video.mp4","guide_id":67,"callback_url":"http://inference:4000/callbacks/steps"}'
```

**Video processing (File upload):**

```bash
curl -X POST http://localhost:8000/process-video \
  -H "Authorization: Bearer stepwize_test" \
  -F "file=@video.mp4" \
  -F "guide_id=67" \
  -F "callback_url=http://inference:4000/callbacks/steps"
```

**View guide:**

- http://localhost:4000/guides/67

## Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   API Service   │    │ Inference Service│
│   Port: 8000    │───▶│   Port: 4000     │
│                 │    │                  │
│ - Video upload  │    │ - Callback recv  │
│ - Auth validate │    │ - Guide render   │
│ - Mock response │    │ - File storage   │
└─────────────────┘    └──────────────────┘
```

## Service Communication

- Services communicate via Docker network: `stepwize-network`
- API → Inference: `http://inference:4000/callbacks/steps`
- External → API: `http://localhost:8000`
- External → Inference: `http://localhost:4000`

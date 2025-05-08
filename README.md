# AI Helpdesk Assistant

A simple helpdesk chatbot powered by Gemini, implemented in vanilla JavaScript and Node.js.


### 1. Clone the Repository

```bash
git clone https://github.com/orrienn/helpdesk-ai.git
cd helpdesk-ai
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment

Create a ```.env``` file in the root folder with:
```
GEMINI_API_KEY=your_google_generative_ai_key_here
```

### 4. Running locally

Start backend:
```
npm start
```

Start frontend:
```
cd frontend
python -m http.server 8080
```

Then visit ```http://localhost:8080```

### 5. Docker instructions

Build docker image:
```
docker build -t helpdesk-ai .
```

Run container:
```
docker run -p 3000:3000 --env-file .env helpdesk-ai
```

You will still need to serve the ```frontend``` folder separately:
```
cd frontend
python -m http.server 8080
```

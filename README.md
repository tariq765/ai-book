# The AI Engineering Handbook 🚀

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator, featuring an interactive AI Chatbot and a comprehensive 30-chapter curriculum across 9 parts.

---

## 💻 Frontend (Docusaurus Website)

### Installation

```bash
npm install
```

### Local Development (Homepage & Docs)

```bash
npm start
```

This command starts a local development server at `http://localhost:3000` and opens up your browser. Most changes are reflected live without having to restart the server.

- **Homepage:** `http://localhost:3000/`
- **Book / Chapters:** `http://localhost:3000/docs/intro`
- **Blog:** `http://localhost:3000/blog`

### Build

```bash
npm run build
```

This command generates static content into the `build` directory for deployment.


---

## Chatbot Backend

Backend FastAPI aur Python par based hai jo `chatbot-backend` directory mein mojood hai.

### Backend Setup & Installation

```bash
# Backend directory mai jao
cd chatbot-backend

# Requirements install karo
pip install -r requirements.txt
```

### Backend Run Command

```bash
# Backend start karne ke liye
python run.py
```

*Alternative direct uvicorn command:*
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend server `http://localhost:8000` par run hoga aur API docs `http://localhost:8000/docs` par access ki ja sakti hain.


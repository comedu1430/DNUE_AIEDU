# microbit-agent

## Run

```bash
cd /Users/almond/Documents/Playground/microbit-agent
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
cp .env.example .env
uvicorn microbit_agent.app:app --app-dir src --host 127.0.0.1 --port 8002
```

Open: http://127.0.0.1:8002


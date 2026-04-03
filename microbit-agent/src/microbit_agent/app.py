from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .agent import apply_debug_suggestion, debug_microbit_code, generate_microbit_content

ROOT_DIR = Path(__file__).resolve().parents[2]
STATIC_DIR = ROOT_DIR / "static"

app = FastAPI(title="Microbit Agent")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    type: str
    title: str
    message: str
    code: str
    explanation: list[str]
    tweaks: list[str]


class DebugSuggestion(BaseModel):
    title: str
    reason: str
    action: str


class DebugAnalyzeRequest(BaseModel):
    code: str
    context: str = ""


class DebugAnalyzeResponse(BaseModel):
    understanding: list[str]
    risk_checks: list[str]
    suggestions: list[DebugSuggestion]


class DebugApplyRequest(BaseModel):
    code: str
    suggestion: str
    context: str = ""


class DebugApplyResponse(BaseModel):
    code: str
    message: str


@app.get("/")
def home() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    result = generate_microbit_content(payload.message)
    session_id = payload.session_id or str(uuid4())
    return ChatResponse(
        session_id=session_id,
        type="result",
        title=str(result.get("title", "micro:bit 작품")),
        message=str(result.get("message", "")),
        code=str(result.get("code", "")),
        explanation=[str(x) for x in result.get("explanation", [])],
        tweaks=[str(x) for x in result.get("tweaks", [])],
    )


@app.post("/api/debug/analyze", response_model=DebugAnalyzeResponse)
def debug_analyze(payload: DebugAnalyzeRequest) -> DebugAnalyzeResponse:
    result = debug_microbit_code(payload.code, payload.context)
    suggestions = [
        DebugSuggestion(
            title=str(item.get("title", "개선 제안")),
            reason=str(item.get("reason", "")),
            action=str(item.get("action", "")),
        )
        for item in result.get("suggestions", [])
        if isinstance(item, dict)
    ]
    return DebugAnalyzeResponse(
        understanding=[str(x) for x in result.get("understanding", [])],
        risk_checks=[str(x) for x in result.get("risk_checks", [])],
        suggestions=suggestions,
    )


@app.post("/api/debug/apply", response_model=DebugApplyResponse)
def debug_apply(payload: DebugApplyRequest) -> DebugApplyResponse:
    result = apply_debug_suggestion(payload.code, payload.suggestion, payload.context)
    return DebugApplyResponse(
        code=str(result.get("code", payload.code)),
        message=str(result.get("message", "개선 제안을 반영했어요.")),
    )

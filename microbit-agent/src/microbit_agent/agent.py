from __future__ import annotations

from typing import Any

from openai import OpenAI

from .config import OPENAI_API_KEY, OPENAI_MODEL


SYSTEM_PROMPT = """너는 초등학생을 위한 micro:bit 코딩 선생님이다.
항상 한국어로 쉬운 문장으로 설명한다.
반드시 micro:bit MicroPython 문법으로만 코드를 작성한다.
응답은 JSON으로만 출력한다.
형식:
{
  "title": "프로젝트 이름",
  "message": "한 줄 요약",
  "code": "전체 코드",
  "explanation": ["쉬운 설명1", "쉬운 설명2", "쉬운 설명3"],
  "tweaks": ["바꿔보기1", "바꿔보기2", "바꿔보기3"]
}
"""

DEBUG_ANALYZE_PROMPT = """너는 micro:bit MicroPython 디버깅 도우미다.
목표는 초등학생이 만든 코드를 더 안전하고 잘 작동하게 고치는 것이다.
반드시 한국어로 답하고, JSON만 출력한다.
형식:
{
  "understanding": ["코드가 하는 일 1", "코드가 하는 일 2"],
  "risk_checks": ["문제 가능성 1", "문제 가능성 2"],
  "suggestions": [
    {
      "title": "개선 제목",
      "reason": "왜 고치면 좋은지",
      "action": "어떻게 고칠지 한 줄 행동"
    }
  ]
}
조건:
- suggestions는 2~4개
- 각 action은 실제 코드 수정이 가능한 구체 문장
"""

DEBUG_APPLY_PROMPT = """너는 micro:bit MicroPython 코드 수정기다.
주어진 코드에 특정 개선 요청 1개를 적용한다.
반드시 한국어 JSON만 출력한다.
형식:
{
  "code": "개선이 반영된 전체 코드",
  "message": "적용 결과 한 줄 설명"
}
조건:
- 반드시 micro:bit MicroPython 문법 유지
- 코드 전체를 완성된 형태로 출력
"""


def _fallback_result(message: str) -> dict[str, Any]:
    code = """from microbit import *
import music

# 요청에 맞는 기본 예시 코드
while True:
    if accelerometer.was_gesture("shake"):
        display.show(Image.HEART)
        music.play(music.BA_DING)
        sleep(400)
        display.clear()
    sleep(100)
"""
    return {
        "title": "micro:bit 작품",
        "message": f"요청을 바탕으로 기본 코드를 만들었어요: {message[:32]}",
        "code": code,
        "explanation": [
            "반복문에서 계속 상태를 확인해요.",
            "흔들기 감지가 되면 하트와 소리를 보여줘요.",
            "잠깐 기다린 뒤 화면을 지워서 다음 동작을 준비해요.",
        ],
        "tweaks": [
            "하트 아이콘을 다른 그림으로 바꿔보기",
            "소리를 다른 멜로디로 바꿔보기",
            "sleep 값을 조절해서 반응 속도 바꿔보기",
        ],
    }


def _fallback_debug_analysis(code: str) -> dict[str, Any]:
    has_loop = "while True" in code
    has_sleep = "sleep(" in code
    return {
        "understanding": [
            "반복문 안에서 센서나 조건을 계속 확인하고 있어요." if has_loop else "조건에 따라 화면이나 소리를 바꾸는 코드예요.",
            "조건이 맞으면 LED 표시나 소리로 반응하도록 만들었어요.",
        ],
        "risk_checks": [
            "반복문에 쉬는 시간(sleep)이 너무 짧으면 반응이 너무 빠르게 반복될 수 있어요." if has_sleep else "sleep이 없으면 동작이 너무 빠르게 반복될 수 있어요.",
            "조건문이 겹치면 원하는 순서와 다르게 동작할 수 있어요.",
        ],
        "suggestions": [
            {
                "title": "반응 속도 안정화",
                "reason": "동작이 너무 빠르면 화면이 깜빡이고 소리가 겹칠 수 있어요.",
                "action": "반복문 끝에 sleep(100) 이상을 넣거나 값을 조금 늘리기",
            },
            {
                "title": "기본 화면 정리",
                "reason": "조건이 아닐 때 표시를 정리하면 동작 상태를 이해하기 쉬워요.",
                "action": "조건이 아닐 때 display.clear() 또는 기본 아이콘 표시하기",
            },
        ],
    }


def _fallback_apply_suggestion(code: str, suggestion: str) -> dict[str, Any]:
    if "sleep" in suggestion and "sleep(" in code:
        updated = code.replace("sleep(100)", "sleep(200)")
    elif "display.clear" in suggestion and "display.clear()" not in code:
        updated = f"{code.rstrip()}\n\n# 개선 반영\ndisplay.clear()\n"
    else:
        updated = f"{code.rstrip()}\n\n# 개선 반영: {suggestion}\n"
    return {
        "code": updated,
        "message": "개선 제안을 반영해 코드를 업데이트했어요.",
    }


def generate_microbit_content(message: str) -> dict[str, Any]:
    if not OPENAI_API_KEY:
        return _fallback_result(message)

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.responses.create(
            model=OPENAI_MODEL,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            temperature=0.2,
        )
        text = response.output_text.strip()
        # Simple safe parse path: ask model to emit JSON only; if parse fails fallback.
        import json

        parsed = json.loads(text)
        if not isinstance(parsed, dict):
            return _fallback_result(message)
        required = {"title", "message", "code", "explanation", "tweaks"}
        if not required.issubset(parsed.keys()):
            return _fallback_result(message)
        return parsed
    except Exception:
        return _fallback_result(message)


def debug_microbit_code(code: str, context: str = "") -> dict[str, Any]:
    if not OPENAI_API_KEY:
        return _fallback_debug_analysis(code)

    user_message = f"프로젝트 맥락:\n{context}\n\n코드:\n{code}"
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.responses.create(
            model=OPENAI_MODEL,
            input=[
                {"role": "system", "content": DEBUG_ANALYZE_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
        )
        text = response.output_text.strip()
        import json

        parsed = json.loads(text)
        if not isinstance(parsed, dict):
            return _fallback_debug_analysis(code)
        required = {"understanding", "risk_checks", "suggestions"}
        if not required.issubset(parsed.keys()):
            return _fallback_debug_analysis(code)
        return {
            "understanding": [str(x) for x in parsed.get("understanding", [])],
            "risk_checks": [str(x) for x in parsed.get("risk_checks", [])],
            "suggestions": [
                {
                    "title": str(item.get("title", "개선 제안")),
                    "reason": str(item.get("reason", "")),
                    "action": str(item.get("action", "")),
                }
                for item in parsed.get("suggestions", [])
                if isinstance(item, dict)
            ],
        }
    except Exception:
        return _fallback_debug_analysis(code)


def apply_debug_suggestion(code: str, suggestion: str, context: str = "") -> dict[str, Any]:
    if not OPENAI_API_KEY:
        return _fallback_apply_suggestion(code, suggestion)

    user_message = (
        f"프로젝트 맥락:\n{context}\n\n"
        f"현재 코드:\n{code}\n\n"
        f"적용할 개선 요청:\n{suggestion}"
    )
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.responses.create(
            model=OPENAI_MODEL,
            input=[
                {"role": "system", "content": DEBUG_APPLY_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.15,
        )
        text = response.output_text.strip()
        import json

        parsed = json.loads(text)
        if not isinstance(parsed, dict):
            return _fallback_apply_suggestion(code, suggestion)
        if "code" not in parsed:
            return _fallback_apply_suggestion(code, suggestion)
        return {
            "code": str(parsed.get("code", code)),
            "message": str(parsed.get("message", "개선 제안을 반영했어요.")),
        }
    except Exception:
        return _fallback_apply_suggestion(code, suggestion)

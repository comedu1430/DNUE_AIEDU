const steps = [
  { key: "name", summary: "장치 이름" },
  { key: "problem", summary: "해결할 고민" },
  { key: "situation", summary: "작동 상황" },
  { key: "sensors", summary: "센서" },
  { key: "logic", summary: "센서 조건" },
  { key: "responses", summary: "동작 방식" },
];

const SENSOR_OPTIONS = ["가속도 센서(흔들림 감지)", "빛 센서(밝기)", "소리 센서", "온도 센서", "터치 센서"];
const LOGIC_OPTIONS = ["둘 다 만족할 때(and)", "하나만 만족해도(or)"];
const RESPONSE_OPTIONS = ["LED 그림 보여주기", "소리 내기", "숫자 보여주기", "문자 보여주기", "아이콘 깜빡이기"];

const elements = {
  landingStage: document.querySelector("#landing-stage"),
  sensorChoiceGrid: document.querySelector("#sensor-choice-grid"),
  logicChoiceGrid: document.querySelector("#logic-choice-grid"),
  responseChoiceGrid: document.querySelector("#response-choice-grid"),
  reviewStage: document.querySelector("#review-stage"),
  reviewList: document.querySelector("#review-list"),
  generateButton: document.querySelector("#generate-button"),
  generationStatus: document.querySelector("#generation-status"),
  resultStage: document.querySelector("#result-stage"),
  resultTitle: document.querySelector("#result-title"),
  resultSummary: document.querySelector("#result-summary"),
  resultCode: document.querySelector("#result-code"),
  resultExplanation: document.querySelector("#result-explanation"),
  resultTweaks: document.querySelector("#result-tweaks"),
  copyButton: document.querySelector("#copy-button"),
  debugButton: document.querySelector("#debug-button"),
  editCodeButton: document.querySelector("#edit-code-button"),
  openEditorSection: document.querySelector("#open-editor-section"),
  openEditorHero: document.querySelector("#open-editor-hero"),
  reviseForm: document.querySelector("#revise-form"),
  reviseInput: document.querySelector("#revise-input"),
  reviseButton: document.querySelector("#revise-button"),
  restartButton: document.querySelector("#restart-button"),
  debugModal: document.querySelector("#debug-modal"),
  debugClose: document.querySelector("#debug-close"),
  debugStatus: document.querySelector("#debug-status"),
  debugUnderstanding: document.querySelector("#debug-understanding"),
  debugRisks: document.querySelector("#debug-risks"),
  debugSuggestions: document.querySelector("#debug-suggestions"),
};

const flowButtons = Array.from(document.querySelectorAll("[data-start-flow]"));
const sectionEls = steps.map((_, index) => document.querySelector(`#step-${index}`));
const answerForms = Array.from(document.querySelectorAll(".answer-form"));
const jumpButtons = Array.from(document.querySelectorAll(".back-jump"));

const answers = {
  name: "",
  problem: "",
  situation: "",
  sensors: [],
  sensorNote: "",
  logic: "",
  logicNote: "",
  responses: [],
  responseNote: "",
};

let sessionId = null;
let unlockedStepIndex = -1;
let debugSuggestionsState = [];

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { detail: raw || "서버 응답을 읽지 못했어요." };
  }
  if (!response.ok) throw new Error(data.detail || "요청 처리 중 문제가 생겼어요.");
  return data;
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function openMicrobitEditor() {
  window.open("https://python.microbit.org/", "_blank", "noopener,noreferrer");
}

function scrollToElement(element) {
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function revealAndFocusStep(index) {
  const section = sectionEls[index];
  if (!section) return;
  section.classList.remove("hidden");
  const input = section.querySelector(".answer-input");
  window.requestAnimationFrame(() => {
    scrollToElement(section);
    input?.focus();
  });
}

function unlockStep(index) {
  if (index > unlockedStepIndex) unlockedStepIndex = index;
  for (let i = 0; i <= unlockedStepIndex; i += 1) {
    if (!sectionEls[i]) continue;
    if (i === 4 && answers.sensors.length <= 1) {
      sectionEls[i].classList.add("hidden");
      continue;
    }
    sectionEls[i].classList.remove("hidden");
  }
}

function summaryValue(key) {
  if (key === "sensors") return [answers.sensors.join(", "), answers.sensorNote].filter(Boolean).join(" / ") || "없음";
  if (key === "logic") return answers.sensors.length <= 1 ? "센서가 하나라서 조건 결합 없음" : [answers.logic, answers.logicNote].filter(Boolean).join(" / ") || "없음";
  if (key === "responses") return [answers.responses.join(", "), answers.responseNote].filter(Boolean).join(" / ") || "없음";
  return answers[key] || "없음";
}

function renderMultiChoice(grid, options, selectedValues, onToggle, single = false) {
  grid.innerHTML = "";
  options.forEach((option) => {
    const active = single ? selectedValues === option : selectedValues.includes(option);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-card${active ? " active" : ""}`;
    button.textContent = option;
    button.addEventListener("click", () => onToggle(option));
    grid.appendChild(button);
  });
}

function renderAllChoices() {
  renderMultiChoice(elements.sensorChoiceGrid, SENSOR_OPTIONS, answers.sensors, (option) => {
    answers.sensors = answers.sensors.includes(option) ? answers.sensors.filter((item) => item !== option) : [...answers.sensors, option];
    renderAllChoices();
  });
  renderMultiChoice(elements.logicChoiceGrid, LOGIC_OPTIONS, answers.logic, (option) => {
    answers.logic = option;
    renderAllChoices();
  }, true);
  renderMultiChoice(elements.responseChoiceGrid, RESPONSE_OPTIONS, answers.responses, (option) => {
    answers.responses = answers.responses.includes(option) ? answers.responses.filter((item) => item !== option) : [...answers.responses, option];
    renderAllChoices();
  });
}

function saveStep(index) {
  const value = sectionEls[index].querySelector(".answer-input").value.trim();
  if (index === 0) answers.name = value;
  if (index === 1) answers.problem = value;
  if (index === 2) answers.situation = value;
  if (index === 3) answers.sensorNote = value;
  if (index === 4) answers.logicNote = value;
  if (index === 5) answers.responseNote = value;
}

function stepValid(index) {
  if (index === 0) return Boolean(answers.name);
  if (index === 1) return Boolean(answers.problem);
  if (index === 2) return Boolean(answers.situation);
  if (index === 3) return answers.sensors.length > 0 || Boolean(answers.sensorNote);
  if (index === 4) return answers.sensors.length <= 1 ? true : Boolean(answers.logic || answers.logicNote);
  if (index === 5) return answers.responses.length > 0 || Boolean(answers.responseNote);
  return true;
}

function renderReview() {
  const reviewSteps = steps.filter((step) => !(step.key === "logic" && answers.sensors.length <= 1));
  elements.reviewList.innerHTML = reviewSteps.map((step) => `
    <article class="review-item">
      <div>
        <p class="review-key">${escapeHtml(step.summary)}</p>
        <div class="review-value">${escapeHtml(summaryValue(step.key))}</div>
      </div>
      <button class="mini-button" type="button" data-edit-step="${steps.findIndex((item) => item.key === step.key)}">이 질문 수정</button>
    </article>
  `).join("");

  elements.reviewList.querySelectorAll("[data-edit-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const stepIndex = Number(button.dataset.editStep);
      revealAndFocusStep(stepIndex);
    });
  });
}

function buildPrompt() {
  return [
    "초등학생이 사용할 micro:bit MicroPython 장치를 만들어줘.",
    `장치 이름: ${summaryValue("name")}`,
    `누구의 어떤 고민을 해결하는지: ${summaryValue("problem")}`,
    `작동 상황: ${summaryValue("situation")}`,
    `사용 센서: ${summaryValue("sensors")}`,
    `센서 조건: ${summaryValue("logic")}`,
    `반응 방식: ${summaryValue("responses")}`,
    "반드시 micro:bit MicroPython 문법으로 전체 코드를 작성하고, 쉬운 한국어 설명과 바꿔보기 아이디어도 함께 줘.",
  ].join("\n");
}

function buildRevisionPrompt(request) {
  return [
    "다음 micro:bit MicroPython 코드를 수정해줘.",
    `현재 코드:\n${elements.resultCode.value}`,
    `수정 요청: ${request}`,
    "반드시 전체 코드를 다시 작성하고, 쉬운 한국어 설명과 바꿔보기 아이디어도 함께 줘.",
  ].join("\n");
}

function autoResizeCodeEditor() {
  elements.resultCode.style.height = "auto";
  elements.resultCode.style.height = `${Math.max(elements.resultCode.scrollHeight, 320)}px`;
}

function normalizeTweak(text) {
  const t = (text || "").trim();
  if (!t) return "";
  if (t.endsWith("보기") || t.endsWith("하기") || t.endsWith("바꾸기")) return t;
  if (t.endsWith("해보세요.")) return t.replace(/해보세요\.$/, "하기");
  if (t.endsWith("바꿔보세요.")) return t.replace(/바꿔보세요\.$/, "바꾸기");
  if (t.endsWith("보세요.")) return t.replace(/보세요\.$/, "보기");
  if (t.endsWith(".")) return `${t.slice(0, -1)}하기`;
  return `${t} 하기`;
}

function localDebugAnalyze(code) {
  const lower = code.toLowerCase();
  const hasWhile = lower.includes("while true");
  const hasSleep = lower.includes("sleep(");
  const hasClear = lower.includes("display.clear");
  const hasGesture = lower.includes("was_gesture");
  const hasMusic = lower.includes("music.play");

  const understanding = [
    hasWhile ? "반복문으로 센서 상태를 계속 확인하고 있어요." : "조건이 맞을 때만 동작하는 코드예요.",
    hasMusic ? "조건이 맞으면 소리로 알림을 주도록 만들었어요." : "조건이 맞으면 화면 표시 중심으로 반응해요.",
  ];

  const riskChecks = [
    hasSleep ? "반복 주기가 너무 짧으면 반응이 너무 빠르게 반복될 수 있어요." : "sleep이 없으면 동작이 너무 빠르게 반복될 수 있어요.",
    hasGesture ? "센서 조건이 한 가지라 오작동을 줄이려면 보조 조건을 추가할 수 있어요." : "조건문 순서에 따라 일부 반응이 건너뛰어질 수 있어요.",
  ];

  const suggestions = [
    {
      title: "반응 속도 안정화",
      reason: "너무 빠른 반복은 화면 깜빡임을 만들 수 있어요.",
      action: "반복문 마지막 sleep 값을 조금 늘리기",
      status: "",
    },
    {
      title: "기본 화면 정리",
      reason: "조건이 아닐 때 화면을 정리하면 상태를 이해하기 쉬워요.",
      action: "조건이 아닐 때 display.clear() 또는 기본 아이콘 표시하기",
      status: "",
    },
  ];

  if (!hasGesture) {
    suggestions.push({
      title: "센서 조건 보강",
      reason: "센서 조건을 추가하면 오작동 가능성을 줄일 수 있어요.",
      action: "현재 조건에 센서 한 가지를 더 추가하기",
      status: "",
    });
  }

  return { understanding, risk_checks: riskChecks, suggestions };
}

function localApplySuggestion(code, actionText) {
  let next = code;
  if (actionText.includes("sleep") && code.includes("sleep(100)")) {
    next = code.replaceAll("sleep(100)", "sleep(200)");
  } else if (actionText.includes("display.clear") && !code.includes("display.clear()")) {
    next = `${code.trimEnd()}\n\n# 개선 반영\ndisplay.clear()\n`;
  } else if (actionText.includes("센서") && code.includes("if ") && !code.includes("and")) {
    next = code.replace(/if\s+(.+):/, "if ($1) and button_a.is_pressed():");
  } else {
    next = `${code.trimEnd()}\n\n# 개선 반영: ${actionText}\n`;
  }
  return {
    code: next,
    message: "개선 제안을 반영해 코드를 업데이트했어요.",
  };
}

function renderList(container, items, clickable = false) {
  container.innerHTML = items.map((item) => {
    const content = clickable ? normalizeTweak(item) : item;
    return `<div class="result-item"${clickable ? ` data-tweak="${escapeHtml(content)}"` : ""}>${escapeHtml(content)}</div>`;
  }).join("");
  if (clickable) {
    container.querySelectorAll("[data-tweak]").forEach((node) => {
      node.addEventListener("click", () => {
        elements.reviseInput.value = node.getAttribute("data-tweak") || "";
        elements.reviseInput.focus();
        scrollToElement(elements.reviseForm.closest(".revise-card"));
      });
    });
  }
}

function openDebugModal() {
  if (!elements.debugModal) return;
  elements.debugModal.classList.remove("hidden");
  elements.debugModal.setAttribute("aria-hidden", "false");
}

function closeDebugModal() {
  if (!elements.debugModal) return;
  elements.debugModal.classList.add("hidden");
  elements.debugModal.setAttribute("aria-hidden", "true");
}

function renderDebugSimpleList(container, items) {
  container.innerHTML = items.map((item) => `<div class="debug-item">${escapeHtml(item)}</div>`).join("");
}

function renderDebugSuggestions() {
  elements.debugSuggestions.innerHTML = debugSuggestionsState.map((item, index) => {
    const statusText = item.status === "applied" ? "적용됨" : item.status === "rejected" ? "거부함" : "";
    return `
      <article class="debug-item">
        <div class="suggestion-title">${escapeHtml(item.title)}</div>
        <p class="suggestion-reason">${escapeHtml(item.reason)}</p>
        <p class="suggestion-action">${escapeHtml(item.action)}</p>
        <div class="suggestion-buttons">
          <button class="mini-button" type="button" data-debug-apply="${index}" ${item.status ? "disabled" : ""}>예, 적용</button>
          <button class="mini-button" type="button" data-debug-reject="${index}" ${item.status ? "disabled" : ""}>아니오</button>
          ${statusText ? `<span class="debug-status">${statusText}</span>` : ""}
        </div>
      </article>
    `;
  }).join("");

  elements.debugSuggestions.querySelectorAll("[data-debug-apply]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.debugApply);
      const suggestion = debugSuggestionsState[index];
      if (!suggestion) return;
      elements.debugStatus.textContent = "개선 제안을 적용하고 있어요...";
      try {
        let data;
        try {
          data = await postJson("/api/debug/apply", {
            code: elements.resultCode.value,
            suggestion: suggestion.action,
            context: elements.resultSummary.textContent || "",
          });
        } catch {
          data = localApplySuggestion(elements.resultCode.value, suggestion.action);
        }
        elements.resultCode.value = data.code || elements.resultCode.value;
        autoResizeCodeEditor();
        debugSuggestionsState[index].status = "applied";
        renderDebugSuggestions();
        elements.debugStatus.textContent = data.message || "개선이 적용됐어요.";
      } catch (error) {
        window.alert(error.message);
        elements.debugStatus.textContent = "개선 적용에 실패했어요.";
      }
    });
  });

  elements.debugSuggestions.querySelectorAll("[data-debug-reject]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.debugReject);
      if (!debugSuggestionsState[index]) return;
      debugSuggestionsState[index].status = "rejected";
      renderDebugSuggestions();
      elements.debugStatus.textContent = "선택하지 않은 제안은 그대로 건너뛰었어요.";
    });
  });
}

async function runDebugAnalyze() {
  const code = (elements.resultCode.value || "").trim();
  if (!code) {
    window.alert("먼저 코드를 만든 뒤 디버깅을 눌러주세요.");
    return;
  }
  openDebugModal();
  elements.debugStatus.textContent = "코드를 분석하고 있어요...";
  elements.debugUnderstanding.innerHTML = "";
  elements.debugRisks.innerHTML = "";
  elements.debugSuggestions.innerHTML = "";

  try {
    let data;
    try {
      data = await postJson("/api/debug/analyze", {
        code,
        context: elements.resultSummary.textContent || "",
      });
    } catch {
      data = localDebugAnalyze(code);
    }
    renderDebugSimpleList(elements.debugUnderstanding, data.understanding || []);
    renderDebugSimpleList(elements.debugRisks, data.risk_checks || []);
    debugSuggestionsState = (data.suggestions || []).map((item) => ({
      title: item.title || "개선 제안",
      reason: item.reason || "",
      action: item.action || "",
      status: "",
    }));
    renderDebugSuggestions();
    elements.debugStatus.textContent = "분석이 끝났어요. 각 제안을 선택해 주세요.";
  } catch (error) {
    window.alert(error.message);
    elements.debugStatus.textContent = "분석에 실패했어요.";
  }
}

async function sendGenerationPrompt(message) {
  const data = await postJson("/api/chat", { session_id: sessionId, message });
  sessionId = data.session_id;
  elements.resultTitle.textContent = answers.name || data.title || "micro:bit 작품";
  elements.resultSummary.textContent = data.message || "";
  elements.resultCode.value = data.code || "";
  autoResizeCodeEditor();
  renderList(elements.resultExplanation, data.explanation || []);
  renderList(elements.resultTweaks, data.tweaks || [], true);
}

async function generateProject() {
  elements.generateButton.disabled = true;
  elements.generationStatus.classList.remove("hidden");
  try {
    await sendGenerationPrompt(buildPrompt());
    elements.resultStage.classList.remove("hidden");
    scrollToElement(elements.resultStage);
  } catch (error) {
    window.alert(error.message);
  } finally {
    elements.generateButton.disabled = false;
    elements.generationStatus.classList.add("hidden");
  }
}

async function reviseProject(request) {
  elements.reviseButton.disabled = true;
  try {
    await sendGenerationPrompt(buildRevisionPrompt(request));
  } catch (error) {
    window.alert(error.message);
  } finally {
    elements.reviseButton.disabled = false;
  }
}

async function copyCode() {
  const code = elements.resultCode.value || "";
  if (!code) return;
  await navigator.clipboard.writeText(code);
  const old = elements.copyButton.textContent;
  elements.copyButton.textContent = "복사됨";
  setTimeout(() => { elements.copyButton.textContent = old; }, 1400);
}

function resetAll() {
  sessionId = null;
  unlockedStepIndex = -1;
  Object.assign(answers, {
    name: "", problem: "", situation: "", sensors: [], sensorNote: "", logic: "", logicNote: "", responses: [], responseNote: "",
  });
  answerForms.forEach((form) => form.reset());
  sectionEls.forEach((section) => section.classList.add("hidden"));
  elements.reviewStage.classList.add("hidden");
  elements.resultStage.classList.add("hidden");
  elements.generationStatus.classList.add("hidden");
  elements.reviseInput.value = "";
  renderAllChoices();
  scrollToElement(elements.landingStage);
}

function startFlow() {
  unlockStep(0);
  revealAndFocusStep(0);
}

flowButtons.forEach((button) => button.addEventListener("click", startFlow));

function handleStepSubmit(form) {
  const stepIndex = Number(form.dataset.stepIndex);
  saveStep(stepIndex);
  renderAllChoices();
  if (!stepValid(stepIndex)) {
    window.alert("답을 입력해주세요");
    return;
  }
  if (stepIndex < steps.length - 1) {
    let nextIndex = stepIndex + 1;
    if (nextIndex === 4 && answers.sensors.length <= 1) {
      sectionEls[4].classList.add("hidden");
      nextIndex = 5;
    }
    unlockStep(nextIndex);
    revealAndFocusStep(nextIndex);
    return;
  }
  renderReview();
  elements.reviewStage.classList.remove("hidden");
  scrollToElement(elements.reviewStage);
}

answerForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleStepSubmit(form);
  });

  const primaryButton = form.querySelector('button[type="submit"]');
  primaryButton?.addEventListener("click", (event) => {
    event.preventDefault();
    handleStepSubmit(form);
  });
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = Number(button.dataset.targetStep);
    revealAndFocusStep(target);
  });
});

elements.generateButton.addEventListener("click", generateProject);
elements.copyButton.addEventListener("click", copyCode);
elements.debugButton?.addEventListener("click", runDebugAnalyze);
elements.editCodeButton.addEventListener("click", () => elements.resultCode.focus());
elements.openEditorSection.addEventListener("click", openMicrobitEditor);
if (elements.openEditorHero) {
  elements.openEditorHero.addEventListener("click", openMicrobitEditor);
}
elements.restartButton.addEventListener("click", resetAll);
elements.resultCode.addEventListener("input", autoResizeCodeEditor);
elements.debugClose?.addEventListener("click", closeDebugModal);
elements.debugModal?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeDebug === "true") closeDebugModal();
});

elements.reviseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const request = elements.reviseInput.value.trim();
  if (!request) {
    window.alert("고치고 싶은 내용을 적어줘.");
    return;
  }
  await reviseProject(request);
  elements.reviseInput.value = "";
});

renderAllChoices();

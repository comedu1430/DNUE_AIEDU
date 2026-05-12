import { useState } from "react";
import { PRIVATE_PAGE_PASSWORD } from "../../../siteData";

function GraduationPasswordGate({ language, onUnlock, onBack }) {
  const isKorean = language === "ko";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password === PRIVATE_PAGE_PASSWORD) {
      setError("");
      setPassword("");
      onUnlock();
      return;
    }

    setError(isKorean ? "비밀번호가 올바르지 않습니다." : "The password is incorrect.");
  };

  return (
    <div className={`private-gate-shell ${onBack ? "private-gate-shell-with-back" : ""}`}>
      {onBack ? (
        <button type="button" className="news-detail-back private-gate-back" onClick={onBack}>
          ← {isKorean ? "운영 프로그램 목록으로 돌아가기" : "Back to program list"}
        </button>
      ) : null}
      <div className="private-gate-content">
        <form className="private-gate-form private-gate-form-minimal" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="private-page-password">
            {isKorean ? "비밀번호" : "Password"}
          </label>
          <input
            id="private-page-password"
            className="private-gate-input"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder={isKorean ? "비밀번호를 입력하세요" : "Enter password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="sr-only" type="submit">
            {isKorean ? "입장하기" : "Enter"}
          </button>
        </form>
        {error ? <p className="private-gate-error">{error}</p> : null}
      </div>
    </div>
  );
}

export { GraduationPasswordGate };

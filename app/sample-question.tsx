"use client";

import { useState } from "react";

type Option = { key: string; text: string; mold: string | null };
type Item = {
  stem: string;
  options: Option[];
  correct_keys: string[];
  rationale: { correct: string; wrong: Record<string, string> };
};

export function SampleQuestion({ item }: { item: Item }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = submitted && selected === item.correct_keys[0];

  return (
    <article className="question-card">
      <form onSubmit={(event) => { event.preventDefault(); if (selected) setSubmitted(true); }}>
        <fieldset disabled={submitted}>
          <legend>{item.stem}</legend>
          <div className="options">
            {item.options.map((option) => (
              <label key={option.key} className={selected === option.key ? "selected" : ""}>
                <input type="radio" name="sample-answer" value={option.key} checked={selected === option.key} onChange={() => setSelected(option.key)} />
                <span className="option-key" aria-hidden="true">{option.key}</span>
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {!submitted && <button className="button" type="submit" disabled={!selected}>Check my reasoning</button>}
      </form>

      <div className="rationale" aria-live="polite">
        {submitted && selected && (
          <>
            <p className={isCorrect ? "result correct" : "result incorrect"}>{isCorrect ? "Sound decision" : "Reconsider the deciding constraint"}</p>
            <h3>Why the best answer wins</h3>
            <p>{item.rationale.correct}</p>
            <h3>Why the other options fail</h3>
            <ul>
              {item.options.filter((option) => !item.correct_keys.includes(option.key)).map((option) => (
                <li key={option.key}><strong>{option.key} · {option.mold?.replaceAll("_", " ")}</strong><span>{item.rationale.wrong[option.key]}</span></li>
              ))}
            </ul>
            <button className="text-button" type="button" onClick={() => { setSubmitted(false); setSelected(null); }}>Try again</button>
          </>
        )}
      </div>
    </article>
  );
}

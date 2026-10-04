import { skills } from './content.js';
export const STORAGE_KEY = 'book-to-play:schell-2:chapter-1:v1';
export function initialState() {
  return { version: 1, view: 'lesson', unit: 0, completed: [], activities: {}, answers: {}, notes: {}, challenge: {}, challengeSubmitted: false, review: {}, completedAt: {}, updatedAt: null };
}
export function restoreState(raw) {
  try {
    const s = JSON.parse(raw);
    if (!s || s.version !== 1) return initialState();
    const result = initialState();
    result.view = ['lesson', 'challenge', 'review', 'notes'].includes(s.view) ? s.view : 'lesson';
    result.unit = Number.isInteger(s.unit) && s.unit >= 0 && s.unit < 4 ? s.unit : 0;
    result.completed = Array.isArray(s.completed) ? [...new Set(s.completed.filter(i => Number.isInteger(i) && i >= 0 && i < 4))] : [];
    const text = value => typeof value === 'string' ? value.slice(0, 100000) : '';
    const date = value => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : null;
    for (const id of ['begin', 'skills', 'listen', 'practice']) result.notes[id] = text(s.notes?.[id]);
    for (let i = 0; i < 4; i++) {
      const id = `u${i}`;
      if (Number.isInteger(s.answers?.[id]) && s.answers[id] >= 0 && s.answers[id] <= 2) result.answers[id] = s.answers[id];
      if (date(s.completedAt?.[i])) result.completedAt[i] = date(s.completedAt[i]);
      const review = s.review?.[i];
      if (Number.isInteger(review?.stage) && review.stage >= 0 && review.stage <= 3 && date(review.lastAt)) result.review[i] = { stage: review.stage, lastAt: date(review.lastAt) };
    }
    for (let i = 0; i < 6; i++) {
      const id = `c${i}`;
      if (Number.isInteger(s.challenge?.[id]) && s.challenge[id] >= 0 && s.challenge[id] <= 2) result.challenge[id] = s.challenge[id];
    }
    const a = s.activities;
    result.activities.begin = { decision: Number.isInteger(a?.begin?.decision) && a.begin.decision >= 0 && a.begin.decision <= 2 ? a.begin.decision : null };
    result.activities.skills = { skills: Array.isArray(a?.skills?.skills) ? [...new Set(a.skills.skills.filter(x => skills.includes(x)))] : [], use: text(a?.skills?.use) };
    const matches = {};
    for (let i = 0; i < 5; i++) if (['team', 'audience', 'game', 'client', 'self'].includes(a?.listen?.matches?.[`o${i}`])) matches[`o${i}`] = a.listen.matches[`o${i}`];
    result.activities.listen = { matches, checked: a?.listen?.checked === true };
    result.activities.practice = { plan: { 0: text(a?.practice?.plan?.[0]), 1: text(a?.practice?.plan?.[1]), 2: text(a?.practice?.plan?.[2]) } };
    result.activities.chapterPlan = text(a?.chapterPlan);
    result.challengeSubmitted = s.challengeSubmitted === true && Object.keys(result.challenge).length === 6;
    result.updatedAt = typeof s.updatedAt === 'string' ? s.updatedAt : null;
    return result;
  } catch { return initialState(); }
}
export function gradeQuestions(questions, answers) {
  return questions.map(q => ({ id: q.id, answered: Number.isInteger(answers[q.id]) && answers[q.id] >= 0 && answers[q.id] < q.options.length, correct: answers[q.id] === q.correct }));
}
export const REVIEW_INTERVALS = [1, 3, 7];
export function nextReviewDate(completedAt, review) {
  if (!completedAt) return null;
  const stage = Number.isInteger(review?.stage) ? Math.max(0, review.stage) : 0;
  if (stage >= REVIEW_INTERVALS.length) return null;
  const date = new Date(review?.lastAt || completedAt);
  if (Number.isNaN(date.getTime())) return null;
  const delay = stage === 0 ? 1 : REVIEW_INTERVALS[stage] - REVIEW_INTERVALS[stage - 1];
  date.setDate(date.getDate() + delay);
  return date.toISOString();
}
export function recordReview(review, remembered, now = new Date().toISOString()) {
  return { stage: remembered ? Math.min(3, (Number.isInteger(review?.stage) ? Math.max(0, review.stage) : 0) + 1) : 0, lastAt: now };
}
export function downloadName() { return `第一章学习笔记-${new Date().toISOString().slice(0, 10)}.md`; }

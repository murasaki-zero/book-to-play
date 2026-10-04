import { initialState, restoreState } from './core.js';
export const WORKBOOK_KEY = 'book-to-play:schell-2:workbook:v2';
export function cleanLab(value, depth = 0) {
  if (depth > 12) return null;
  if (typeof value === 'string') return value.slice(0, 100000);
  if (typeof value === 'boolean' || value === null) return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (Array.isArray(value)) return value.slice(0, 100).map(v => cleanLab(v, depth + 1));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k]) => !['__proto__', 'constructor', 'prototype'].includes(k)).slice(0, 100).map(([k,v]) => [k, cleanLab(v, depth + 1)]));
  return null;
}
export function restoreLaterChapter(value) {
  const base = initialState(), common = restoreState(JSON.stringify({ ...value, version: 1 }));
  for (const key of ['view','unit','completed','review','completedAt','updatedAt']) base[key] = common[key];
  const object = v => v && typeof v === 'object' && !Array.isArray(v);
  base.notes = object(value?.notes) ? Object.fromEntries(Object.entries(value.notes).filter(([k,v]) => !['__proto__','constructor','prototype'].includes(k) && typeof v === 'string').map(([k,v]) => [k,v.slice(0,100000)])) : {};
  const incoming = cleanLab(value?.activities);
  base.activities = {};
  if (object(incoming)) for (const [key, a] of Object.entries(incoming)) {
    if (key === 'chapterPlan') { base.activities[key] = typeof a === 'string' ? a : ''; continue; }
    if (key === 'capstoneDone') { if (typeof a === 'string' && !Number.isNaN(Date.parse(a))) base.activities[key] = a; continue; }
    if (key === 'capstoneRevision') { if(Number.isInteger(a)&&a>=0&&a<=100) base.activities[key]=a; continue; }
    if (key === 'rubric') { base.activities[key] = Array.isArray(a) ? [...new Set(a.filter(i => Number.isInteger(i) && i>=0 && i<100))] : []; continue; }
    if (!object(a)) continue;
    const safe = { ...a };
    safe.runs = Array.isArray(a.runs) ? a.runs.filter(object).filter(r => typeof r.summary === 'string').slice(-20) : [];
    for (const field of ['essentials','chain','kept','pruned','slots']) safe[field] = Array.isArray(a[field]) ? a[field].filter(v => typeof v === 'string' || Number.isInteger(v)).slice(0,10) : [];
    safe.visited = Array.isArray(a.visited) ? [...new Set(a.visited.filter(i => Number.isInteger(i) && i>=0 && i<9))] : [];
    if (object(a.config)) safe.config = a.config; else delete safe.config;
    base.activities[key] = safe;
  }
  return base;
}
export function restoreWorkbook(raw, legacyRaw = null) {
  const fresh = { version: 2, currentChapter: 1, chapters: { 1: restoreState(legacyRaw) } };
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 2 || !value.chapters || typeof value.chapters !== 'object') return fresh;
    fresh.currentChapter = Number.isInteger(value.currentChapter) && value.currentChapter >= 1 && value.currentChapter <= 34 ? value.currentChapter : 1;
    for (const [id, chapter] of Object.entries(value.chapters)) {
      if (!/^\d+$/.test(id) || +id < 1 || +id > 34) continue;
      fresh.chapters[id] = +id === 1 ? restoreState(JSON.stringify(chapter)) : restoreLaterChapter(chapter);
    }
  } catch { /* Keep legacy data when a new workbook cannot be read. */ }
  return fresh;
}
export function importWorkbook(value, current) {
  if (value?.version === 1 && Array.isArray(value.completed) && value.activities && value.notes) {
    return { ...current, currentChapter: 1, chapters: { ...current.chapters, 1: restoreState(JSON.stringify(value)) } };
  }
  if (value?.version === 2 && value.chapters && typeof value.chapters === 'object') return restoreWorkbook(JSON.stringify(value));
  throw new Error('Invalid progress backup');
}
export function newGrid(config = {}) {
  return { position: 0, steps: 0, collected: false, outcome: 'playing', moves: [], config: { goal: config.goal !== false, budget: config.budget === 6 ? 6 : 10, obstacles: config.obstacles === true, key: config.key === true } };
}
export function moveGrid(game, direction) {
  if (game.outcome !== 'playing' || !['up','down','left','right'].includes(direction)) return game;
  const p = game.position, row = Math.floor(p / 4), col = p % 4;
  if ((direction === 'up' && row === 0) || (direction === 'down' && row === 3) || (direction === 'left' && col === 0) || (direction === 'right' && col === 3)) return { ...game, notice: '这里是边界，位置和步数没有变化。' };
  const next = p + ({ up: -4, down: 4, left: -1, right: 1 })[direction];
  if (game.config.obstacles && [5,6,9,10].includes(next)) return { ...game, notice: '障碍不可穿过，位置和步数没有变化。' };
  if (next === 15 && game.config.goal && game.config.key && !game.collected) return { ...game, notice: '灯塔门锁着，先到右上角收集钥匙。' };
  const result = { ...game, position: next, steps: game.steps + 1, collected: game.collected || next === 3, moves: [...game.moves, direction], notice: '' };
  if (game.config.goal && next === 15) result.outcome = 'won';
  else if (game.config.goal && result.steps >= game.config.budget) result.outcome = 'lost';
  return result;
}
export function interruptRoute(progress, checkpoint) { return checkpoint ? progress : 0; }

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { initialState, restoreState, gradeQuestions, nextReviewDate, recordReview } from '../dist/core.js';
import { units, listeners, skills, challengeQuestions } from '../dist/content.js';

test('损坏或不兼容的存档仍然可以开始学习', () => {
  for (const value of [null, '{broken', '{}', 'null', '{"version":2}']) assert.deepEqual(restoreState(value), initialState());
  const state = restoreState(JSON.stringify({ version:1, unit:99, view:'unknown', completed:[0,0,5,'1'], notes:{begin:'我会先做纸笔原型'}, activities:{skills:{skills:'bad'},listen:{matches:null}} }));
  assert.equal(state.unit, 0); assert.equal(state.view, 'lesson'); assert.deepEqual(state.completed,[0]);
  assert.equal(state.notes.begin, '我会先做纸笔原型'); assert.deepEqual(state.activities.skills.skills,[]);
});
test('保存后恢复笔记、答案、练习和复习日期', () => {
  const state = initialState();
  Object.assign(state, { unit:2, completed:[0], completedAt:{0:'2026-10-04T10:00:00.000Z'}, notes:{begin:'先做一个设计决定'}, answers:{u0:1}, challenge:{c0:1}, activities:{skills:{skills:['数学'],use:'分析概率'}} });
  state.review[0] = recordReview(undefined,true,'2026-10-05T10:00:00.000Z');
  const saved = restoreState(JSON.stringify(state));
  assert.deepEqual(saved.completed,[0]); assert.equal(saved.unit,2); assert.equal(saved.answers.u0,1); assert.equal(saved.notes.begin,state.notes.begin);
  assert.equal(saved.activities.skills.use,'分析概率'); assert.equal(saved.review[0].stage,1);
});
test('章节评分识别未答、越界、答错和答对，不把未答视为正确', () => {
  const partial = gradeQuestions(challengeQuestions,{c0:1,c1:99,c2:0});
  assert.equal(partial.filter(q=>q.correct).length,1); assert.equal(partial.filter(q=>q.answered).length,2);
  assert.equal(partial[3].answered,false);
  const all = Object.fromEntries(challengeQuestions.map(q=>[q.id,q.correct]));
  assert.equal(gradeQuestions(challengeQuestions,all).filter(q=>q.correct).length,6);
});
test('复习安排在1、3、7天；忘记后重新安排一天，不产生无效日期', () => {
  const start = '2026-10-04T10:00:00.000Z';
  assert.equal(nextReviewDate(start), '2026-10-05T10:00:00.000Z');
  let review = recordReview(undefined,true,'2026-10-05T10:00:00.000Z');
  assert.equal(nextReviewDate(start,review),'2026-10-07T10:00:00.000Z');
  review = recordReview(review,true,'2026-10-07T10:00:00.000Z');
  assert.equal(nextReviewDate(start,review),'2026-10-11T10:00:00.000Z');
  review = recordReview(review,false,'2026-10-08T10:00:00.000Z');
  assert.equal(review.stage,0); assert.equal(nextReviewDate(start,review),'2026-10-09T10:00:00.000Z');
  assert.equal(nextReviewDate('invalid'),null);
  assert.equal(nextReviewDate(start,{stage:3}),null);
});
test('所有原书定位都有本地扫描页，题目与第一章范围一致', async () => {
  const pages = JSON.parse(await readFile(new URL('../content/source-pages.json',import.meta.url),'utf8'));
  assert.equal(pages.filter(p=>p.pdfPage>=49&&p.pdfPage<=56).length,8); assert.equal(skills.length,20); assert.equal(listeners.length,5);
  for (const p of pages) await access(new URL('../dist/'+p.image,import.meta.url));
  for (const u of units) for (const p of [...u.pages,u.question.page]) assert.ok(p>=49&&p<=56);
  for (const q of challengeQuestions) { assert.ok(q.page>=49&&q.page<=56); assert.ok(q.correct>=0&&q.correct<q.options.length); }
});

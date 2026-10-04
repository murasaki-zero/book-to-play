import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapterCatalog, chapterLibrary } from '../dist/chapters.js';
import { lensIndex } from '../dist/lenses.js';

const parseRange = range => {
  const [a, b] = String(range).split('—').map(Number);
  return [a, b];
};

test('章节目录覆盖 1—34 章且编号连续', () => {
  assert.equal(chapterCatalog.length, 34);
  chapterCatalog.forEach((c, i) => assert.equal(c.id, i + 1));
});

test('每章可学内容含 4 个单元且字段完整', () => {
  assert.equal(Object.keys(chapterLibrary).length, 34);
  for (const [id, chapter] of Object.entries(chapterLibrary)) {
    const [pdfStart, pdfEnd] = parseRange(chapter.book.pdfPages);
    assert.ok(Number.isInteger(pdfStart) && Number.isInteger(pdfEnd) && pdfStart < pdfEnd, `第 ${id} 章 pdfPages 无效`);
    assert.match(chapter.book.printedPages, /^\d+—\d+$/, `第 ${id} 章 printedPages 无效`);
    if (+id > 1) {
      assert.ok(Array.isArray(chapter.rubric) && chapter.rubric.length > 0, `第 ${id} 章 rubric 为空`);
      assert.ok(typeof chapter.project === 'string' && chapter.project.trim(), `第 ${id} 章 project 为空`);
    }
    assert.equal(chapter.units.length, 4, `第 ${id} 章单元数不是 4`);
    chapter.units.forEach((u, ui) => {
      assert.ok(u.id && u.nav && u.title && u.idea, `第 ${id} 章单元 ${ui + 1} 基础字段缺失`);
      assert.ok(Array.isArray(u.pages) && u.pages.length > 0 && u.pages.every(p => Number.isInteger(p) && p >= pdfStart && p <= pdfEnd), `第 ${id} 章单元 ${ui + 1} pages 越界`);
      if (+id > 1) assert.ok(typeof u.prompts?.[0] === 'string' && u.prompts[0].trim(), `第 ${id} 章单元 ${ui + 1} prompts 为空`);
      assert.ok(u.review?.prompt && u.review?.answer, `第 ${id} 章单元 ${ui + 1} review 字段缺失`);
      assert.ok(u.activity?.type || u.question, `第 ${id} 章单元 ${ui + 1} activity/question 缺失`);
    });
  }
});

test('透镜索引页码落在原书 PDF 范围内', () => {
  assert.ok(lensIndex.length >= 100);
  for (const lens of lensIndex) {
    assert.ok(Number.isInteger(lens.pdfPage) && lens.pdfPage >= 49 && lens.pdfPage <= 594, `透镜 #${lens.number} pdfPage 越界`);
  }
});

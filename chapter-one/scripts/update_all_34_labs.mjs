// Historical generator: retained for audit only.
throw new Error("历史批量生成脚本已停用：它会覆盖已修复课程。请编辑 dist/course.js / dist/studio.js，参见根目录制作工作流.md。");
import fs from 'fs';

let labsCode = fs.readFileSync('dist/labs.js', 'utf8');

// We need the 72 new lab activity types for chapters 17 to 34 to be handled cleanly in renderLab, labForms, labInstructions, handleLab, labReady.
// Let's get the list of activity types from chapters 17 to 34:
import('../dist/chapters.js').then(ch => {
  const types_17_34 = [];
  for (let i = 17; i <= 34; i++) {
    ch.chapterLibrary[i].units.forEach(u => types_17_34.push(u.activity.type));
  }
  console.log("Types 17-34 count:", types_17_34.length);

  // 1. In renderLab: add types_17_34 to genericLabBoard check
  const genericListStr = types_17_34.map(t => `'${t}'`).join(',');
  labsCode = labsCode.replace(
    "'projectionBlank'].includes(type)) body=genericLabBoard(u,a,r);",
    `'projectionBlank',${genericListStr}].includes(type)) body=genericLabBoard(u,a,r);`
  );

  // 2. In labForms & labInstructions
  const labFormMap = types_17_34.map(t => `${t}:'${t}交互试验台'`).join(',');
  const labInstMap = types_17_34.map(t => `${t}:'切换配置维度，调节参数权重，观察系统状态变化并记录。'`).join(',');

  labsCode = labsCode.replace(
    "projectionBlank:'projectionBlank交互试验台'}",
    `projectionBlank:'projectionBlank交互试验台',${labFormMap}}`
  );
  labsCode = labsCode.replace(
    "projectionBlank:'切换维度选项，调节数值权重，观察状态响应并记录。'}",
    `projectionBlank:'切换维度选项，调节数值权重，观察状态响应并记录。',${labInstMap}}`
  );

  // 3. In labReady: add types_17_34 to generic check
  labsCode = labsCode.replace(
    "'projectionBlank'].includes(type)) return new Set(runs.filter(r=>r.kind===type).map(r=>r.option)).size>=2 || runs.filter(r=>r.kind===type).length>=2;",
    `'projectionBlank',${genericListStr}].includes(type)) return new Set(runs.filter(r=>r.kind===type).map(r=>r.option)).size>=2 || runs.filter(r=>r.kind===type).length>=2;`
  );

  fs.writeFileSync('dist/labs.js', labsCode);
  console.log('dist/labs.js successfully updated for all 34 chapters!');
});

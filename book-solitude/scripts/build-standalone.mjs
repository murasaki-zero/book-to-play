import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function buildStandalone() {
  console.log('Building standalone 开始精读.html for 百年孤独...');

  const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const chaptersJs = fs.readFileSync(path.join(distDir, 'chapters.js'), 'utf8');
  const contextJs = fs.readFileSync(path.join(distDir, 'context.js'), 'utf8');
  const lineageJs = fs.readFileSync(path.join(distDir, 'lineage.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(distDir, 'app.js'), 'utf8');

  // Replace script tags with inlined scripts
  let standalone = html;

  // Replace back button link to ../index.html
  standalone = standalone.replace('href="../../index.html"', 'href="../index.html"');

  const inlinedScripts = `
  <script>
    /* Inlined chapters.js */
    ${chaptersJs}
  </script>
  <script>
    /* Inlined context.js */
    ${contextJs}
  </script>
  <script>
    /* Inlined lineage.js */
    ${lineageJs}
  </script>
  <script>
    /* Inlined app.js */
    ${appJs}
  </script>
  `;

  standalone = standalone.replace(
    /<script src="chapters\.js"><\/script>\s*<script src="context\.js"><\/script>\s*<script src="lineage\.js"><\/script>\s*<script src="app\.js"><\/script>/,
    inlinedScripts
  );

  const outPath = path.join(distDir, '开始精读.html');
  fs.writeFileSync(outPath, standalone, 'utf8');
  console.log('Successfully generated:', outPath, `(size: ${(standalone.length / 1024).toFixed(1)} KB)`);
}

buildStandalone();

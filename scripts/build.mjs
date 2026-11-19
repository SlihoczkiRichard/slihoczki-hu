// Copies only the public site into ./_site (excludes docs/, scripts/, etc.).
// Not required for GitHub Pages or Vercel — provided for any host that wants a clean output folder.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const out = '_site';
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const p of ['index.html', 'favicon.svg', '.nojekyll', 'assets']) cpSync(p, `${out}/${p}`, { recursive: true });
console.log('Static site written to ./_site');

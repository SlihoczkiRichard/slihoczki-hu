# Richard Slihoczki · Portfolio

Personal academic and engineering portfolio of Richard Slihoczki, Computer Engineering student at BME (Intelligent Networks) and Erasmus+ student at UPC-FIB Barcelona. The site covers research on Zero Trust and Security Service Edge, education, experience, projects and contact details.

It is a static site written in plain HTML, CSS and JavaScript. There is no framework, no dependency and no build step, so the repository itself is the deployable site.

## Highlights

- **Retro terminal design** with three switchable themes: DOS (default), C64 and PAPER. The visitor's choice is remembered.
- **Responsive layout** from phone to desktop, plus a dedicated print stylesheet.
- **Keyboard friendly.** Number keys `1`–`9` jump to sections through the bottom key bar.
- **Accessible markup.** ASCII diagrams carry text descriptions, decorative motion respects `prefers-reduced-motion`, and every section is labelled.
- **Works without JavaScript.** Scripts only add extras: theme switching, the animated packet in fig. 1, the footer year and the arcade.
- **Arcade section** with three small canvas games written from scratch.

## Arcade

| Game | Goal | Keyboard | Touch |
|---|---|---|---|
| `SNAKE.EXE` | Eat packets without biting yourself | Arrows / WASD | Swipe to steer |
| `PACKETS.EXE` | Shoot down incoming malware | ← → move, Space fire | Drag to move, hold to fire |
| `BUFFER.EXE` | Clear full rows before the buffer overflows | ← → move, ↑ rotate, ↓ soft drop, Space hard drop | Drag to move, tap to rotate, hold to soft drop, flick down to drop |

On touch devices the games use gestures on the game screen only, without on-screen buttons. Tap the screen to start, resume or retry. A game pauses when it scrolls out of view or loses focus. High scores are stored in the visitor's browser.

## Project structure

```
.
├── index.html                    # the page, source of truth for structure and text
├── favicon.svg
├── .nojekyll                     # GitHub Pages: serve files as-is
├── assets/
│   ├── css/style.css             # themes, layout, print styles
│   ├── js/main.js                # theme switch, key bar, packet animation
│   ├── js/games.js               # SNAKE.EXE, PACKETS.EXE, BUFFER.EXE (canvas, no libraries)
│   ├── fonts/                    # self-hosted fonts and licences
│   ├── img/cursor*.png           # pixel-art mouse cursors
│   └── cv/Richard_Slihoczki_CV.pdf
├── docs/recommendations/         # private drafts, never deployed
├── scripts/
│   └── build.mjs                 # copies the public files into ./_site
├── .github/workflows/pages.yml   # GitHub Pages deployment
└── .vercelignore                 # keeps docs/ and tooling off Vercel
```

## Run locally

Requires Node.js for the dev server. Any static file server also works.

```bash
npm start              # serves the site on http://localhost:3000
npm run build          # optional: writes the public files to ./_site
```

You can also open `index.html` directly, or run `python3 -m http.server`.

To test the touch controls, open the site on a phone on the same network, or use the device toolbar in your browser's developer tools.

## Deployment

**GitHub Pages.** Set **Settings → Pages → Source** to **GitHub Actions**. Every push to `main` then runs the workflow, which publishes only `index.html`, `favicon.svg`, `.nojekyll` and `assets/`. For a custom domain, add it in the Pages settings and create the DNS records GitHub lists.

**Vercel.** Import the repository with the framework preset **Other**, no build command and output directory `.`. The `.vercelignore` file excludes `docs/`, `scripts/` and this README.

> [!WARNING]
> `docs/recommendations/` holds private letter drafts. Do not use the classic "Deploy from branch" Pages mode, because it publishes every file in the repository. If the repository itself is public, those drafts are visible on GitHub regardless of how the site is deployed. Keep them out of the repository or make it private in that case.

## Updating content

All structure and text lives in `index.html`.

### Content

- **Experience or education:** copy an existing `<article class="entry">` block and edit it.
- **Projects:** copy an existing `<article class="win project">` block.
- **Thesis results:** edit the `RESULTS.CSV` table in the Projects section.
- **CV:** overwrite `assets/cv/Richard_Slihoczki_CV.pdf` and keep the file name.
- **ASCII diagrams:** fig. 1 and fig. 2 are `<pre>` blocks. Keep every line's column widths intact, or the boxes stop lining up. The name banner was generated with `pyfiglet -f ansi_shadow`.

The page avoids dated phrases, and the footer year updates itself, so it stays correct without regular edits.

### Open items

- The UPC-FIB project card in the Projects section still contains placeholder text in square brackets. It needs a title, a short description, tags and a link in `index.html`.

## Fonts and licences

All fonts are self-hosted in `assets/fonts/` under free licences.

| Font | Used for | Licence |
|---|---|---|
| 3270 | Body text and ASCII art | BSD-3 / OFL, see `LICENSE-3270.txt` |
| Press Start 2P | C64 theme headings | OFL |
| Courier Prime | PAPER theme | OFL |
| Special Elite | PAPER theme | Apache 2.0 |

## Contact

- GitHub: [SlihoczkiRichard](https://github.com/SlihoczkiRichard)
- LinkedIn: [richardslihoczki](https://linkedin.com/in/richardslihoczki)

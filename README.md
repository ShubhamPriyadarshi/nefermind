# nefermind.com

Official site for **NeferMind Studios** — an independent game studio building **DRIFTRAGE** (a neon-wasteland drift-to-kill arcade game for iOS & Android).

Live at **https://nefermind.com** (GitHub Pages + custom domain).

## Structure
```
index.html        # Landing page (hero, featured game, roadmap, studio, contact)
press.html        # Press kit (fact sheets, art, logos)
CNAME             # Custom domain → nefermind.com
assets/
  site.css        # Shared styles (neon-synthwave design system)
  site.js         # Shared JS (cursor, grid canvas, embers, reveals, magnetic buttons)
  img/            # Game art (interceptor, mob sprites, title screenshot)
```

## Editing content
- **Text / sections:** edit `index.html` or `press.html` directly — all content is inline, no build step.
- **Art:** drop PNGs into `assets/img/` and reference them.
- **Social handles:** search `index.html` for `@driftragegame` / `@nefermindstudios` and replace with the real handles once locked.
- **Email:** `studio@nefermind.com` (general), `press@nefermind.com` (press) — update in both pages once mail is set up.

## Deploy
GitHub Pages serves the `main` branch at the root. Any `git push` to `main` auto-redeploys in ~30s.

```bash
git add -A && git commit -m "update site" && git push
```

## Custom domain setup (one-time)
1. **DNS** at your registrar:
   - `A`  `@` → `185.199.108.153` / `.109` / `.110` / `.111`
   - `CNAME` `www` → `shubhampriyadarshi.github.io`
2. Repo **Settings → Pages → Custom domain** → enter `nefermind.com` → Save → **Enforce HTTPS** (GitHub auto-issues the cert).

## Design system
- Base `#07070d` (asphalt black). Neon: hot-pink `#ff2975`, electric cyan `#00f0ff`, magenta `#b026ff`.
- Display font: **Chakra Petch**. Body: **Space Grotesk**. Mono: **JetBrains Mono**.
- All animations respect `prefers-reduced-motion`; touch devices skip the custom cursor / parallax / magnetic effects.

## License
Code & site © NeferMind Studios. Game art is studio-owned. Press kit assets are free for editorial use.
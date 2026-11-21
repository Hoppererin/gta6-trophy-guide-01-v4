# Vice Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Hoppererin/gta6-trophy-guide-01-v4/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Hoppererin/gta6-trophy-guide-01-v4/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The complete offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — every trophy with its official name, description and grade, a step-by-step guide in our own words, and a citation behind every single step.

## What makes this version different

- **Cited guidance, per step** — 226 steps across the 55 trophies, every one of them carrying 2 sources: **452 citations** to **21 verified guides and lists** (PowerPyx, PushSquare, KeenGamer, PlanetGTA6, Press Start, Radio Times, Insider Gaming, Vice City Hustle, GTABase and more). Each step shows its sources as short chips; the full links sit below the guide.
- **Audit strip** — the header shows the live audit, computed from the data: steps, cited steps, steps with 2+ sources, total citations, distinct sources, and trophies with 2+ sources (55/55).
- **Sources & Audit tab** — a source-by-coverage matrix (list / roadmap / methods / counts) with how many trophies each source backs, plus an honest list of what is still unconfirmed (Bad Luck, I Guess; In The Beginning…; Fair Game; the Chapter 1 meditation).
- **Tracker** — a checklist of all 55 trophies. Tick one when you earn it; progress is saved in your browser (localStorage) and can be exported to a file and imported back.
- **Count trackers** — 29 trophies carry a live counter (e.g. 12/42 Shooting Range golds, 0/100 WAiNK scans, $0 / $250,000 laundered) with − / + steppers.
- **Filters** — by kind (Story, Missable, Collectibles, Activities, Side quests, Crime & feats, Money, Completion, Platinum, Online), by earned / remaining, and by search.
- **Spoiler setting** — hides the names and descriptions of story trophies until you earn them.
- **Roadmap to the Platinum** — 9 stages in order, from the one clean setup run through the story, side strands, activities, robberies, collections and the 100% cleanup. About 200 hours, one playthrough (PowerPyx, 19 Nov 2026).
- **Missables** — the one possibly missable trophy (Positive Mental Attitude, Chapter 1) flagged with exactly when it can be missed, and the other 54 explicitly marked not missable with the reason.

## Sources

All 21 sources, with dates and what each one backs, are listed in the app's Sources & Audit tab and in `app/data/trophies.json`. The main method sources are PowerPyx, PushSquare and KeenGamer; the official list is carried by PlanetGTA6 (from Exophase, cross-checked with PSNProfiles and TrueAchievements) and confirmed by Press Start, Radio Times, Insider Gaming, GTADB, One More Game, GTA Six Insider, GTA Six How, EGamers, GamesFuze, GTASpotter, GTABase, SixShore, GameMapa, GameTrek, Mobalytics, TechNerdiness and Vice City Hustle.

The trophy names, descriptions and grades are the official PlayStation 5 list as PlayStation publishes it. All guide text is written for this entry, in our own words, and cites its sources — nothing is copied.

## Layout

```
app/
  index.html            — the guide: header + audit strip + progress, tabs, toolbar, trophy list
  app.js                — tracker, filters, spoiler setting, export/import, roadmap, missables, sources audit
  style.css             — the guide's own look (Leonida night navy, neon pink + lagoon teal)
  data/trophies.json    — the 55 official trophies with guides, per-step citations, counts, stages
main.ts                 — hands the guide in: copies app/ + screenshots/ to /output, writes dossier.json
vendor/makefun-frontend.ts — the make.fun dossier library (unchanged)
screenshots/           — 4 renders of the app: tracker + cited guide, sources audit, roadmap, missables
```

## How to run it

No build step, no network. Serve `app/` with any static server and open it in desktop Chrome:

```sh
cd app && python3 -m http.server 8080
# open http://localhost:8080/
```

Or from the repository root:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# the built guide is in out/app, with out/dossier.json
```

## Fan disclaimer

Fan-made guide. Not affiliated with, endorsed by, or connected to Rockstar Games, Take-Two Interactive, or PlayStation. Grand Theft Auto and GTA are trademarks of Take-Two Interactive. No Rockstar logo, artwork, box art or game screenshot is used anywhere in this guide.

Entered on [make.fun](https://make.fun/r/dhj53q2r).

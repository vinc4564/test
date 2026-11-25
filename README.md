# Agora 🏛️

An X-style social feed where every post is a seminal paper in **political theory** and
**international relations** — Wendt on anarchy, Mearsheimer on institutions, Fearon on war,
Rawls on justice, Berlin on liberty, Schmitt on the political, and more.

## Run

No build step, no dependencies. Either open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

- X-like three-column dark UI: nav rail, timeline, trending rail (collapses gracefully on mobile)
- Feed of ~30 classic papers with abstract, venue, year, DOI link and topic tags
- Like / repost / bookmark / copy-link actions, persisted in `localStorage`
- Live search over titles, authors, venues, abstracts and topics
- Topic filters (`#realism`, `#norms`, `#justice`, …) from chips, trending rail or Explore view
- Latest / Top sorting, Bookmarks view, deep-linkable posts (`#p-<id>`)
- "Post a paper" composer — adds your own entries to the local feed

## Data

`assets/js/data.js` seeds the feed. Abstracts are concise paraphrases of the original
papers (most are paywalled); each entry links to its DOI or a reference page
(Stanford Encyclopedia of Philosophy / Open Library). To add more papers, append objects
to the `PAPERS` array — no other changes needed.

## Tech

Vanilla HTML/CSS/JS. All state lives in `localStorage` under `agora-state-v1`.
No runtime network calls; works fully offline once loaded.

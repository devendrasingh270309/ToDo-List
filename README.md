# Tasks — Liquid Glass To-Do

A standalone, dependency-free to-do app with an iPhone-style Liquid Glass UI.
Plain HTML + CSS + JavaScript. No build step, no npm, no frameworks, no WebGL.

## Run
Open `index.html` in any modern browser. To deploy, upload the whole folder to any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or a plain web server).

## Features
- Add, edit, delete and complete tasks
- Priority, category and due date/time
- Search, category filter, sort (due, priority, newest, A–Z), views (All, Active, Today, Done)
- Progress ring, due-today/overdue counts and a 7-day completion chart
- Live clock (device local time, updates every second) and greeting: Good Morning 5:00–11:59, Afternoon 12:00–16:59, Evening 17:00–20:59, Night 21:00–4:59
- Dark / Light switch (top-right), animated, saved in LocalStorage (follows system until chosen)
- Tasks saved in LocalStorage
- Responsive: bottom nav on mobile, glass sidebar on desktop, multi-column layout on large screens; scales for 4K, TV and ultrawide
- Keyboard: `N` new task, `/` search, `Esc` close dialog

## Files
- `index.html` – markup
- `style.css` – theme tokens, glass styles, responsive layout
- `script.js` – app logic and persistence
- `assets/favicon.svg` – icon

LocalStorage keys: `todo-glass-v2` (tasks and settings), `todo-theme` (theme).
Note: LocalStorage is per browser and per origin.

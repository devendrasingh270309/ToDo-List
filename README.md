# Task — Liquid Glass To-Do

A standalone, dependency-free to-do app with a 'liquid glass' UI.  
It only uses HTML + CSS + JavaScript. No build step, npm, framework, or WebGL is involved.

## Run (How to use)
Open `index.html` in any modern browser. To deploy, upload the whole folder to any static host  
(such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or any simple web server).

## Features
- Add, edit, delete, and complete tasks  
- Set priority, category, and due date/time  
- Search, category filter, sorting (due date, priority, newest, A–Z), and views (all, active, today, completed)  
- Progress ring, count of today's due tasks/overdue tasks, and a completion chart for the last 7 days  
- Live clock (device’s local time, updating every second) and greeting: Good Morning (5:00–11:59), Afternoon (12:00–16:59), Evening (17:00–20:59), Night (21:00–4:59)  
- Dark/Light mode switch (top right), and ...
- Dark/Light switch (top-right), animated, saved in localStorage (follows system until manually changed) - Tasks saved in localStorage - Responsive: bottom navigation on mobile, glass sidebar on desktop, multi-column layout on large screens; scales for 4K, TV, and ultrawide - Keyboard: `N` new task, `/` search, `Esc` close dialog ## Files - `index.html` – markup - `style.css` – theme tokens, glass styles, responsive layout - `script.js` – app logic and persistence - `assets/favicon.svg` – icon LocalStorage keys: `todo-glass-v2` (tasks and settings), `todo-theme` (theme). Note: localStorage depends on the browser and origin.

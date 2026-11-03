# From Sketch to Screen: portfolio website

A plain HTML, CSS and JavaScript website. No installs, no build step.
It works when opened from your computer and when hosted on GitHub Pages.

Everything you see now is **development content**: text in [square brackets] and
every project marked **Sample** must be replaced with your real information before
the site goes online.

---

## 1. What is in this folder

```
portfolio/
├── index.html                 Homepage (full-screen intro, welcome, about, skills, experience,
│                              education, projects gallery, before & after, CV, contact)
├── css/
│   ├── style.css              Colours, fonts and the homepage design (used by every page)
│   └── project.css            Extra styles for project pages only
├── js/
│   ├── projects.js            ★ YOUR PROJECT LIST. The only file you edit for projects.
│   ├── site.js                Theme switch, mobile menu, scroll effects (every page)
│   ├── home.js                Gallery, search, filters, before & after, contact form
│   └── project.js             Fills in a project page from projects.js
├── projects/
│   ├── _template/index.html   The project page. Copy this folder for each new project.
│   ├── moneyfesting-logo/index.html
│   └── ... one folder per project
├── images/
│   ├── logo/                  Your logo goes here (logo.png)
│   └── projects/              One folder of images per project
└── files/                     Your CV PDF goes here
```

## 2. How the homepage and project pages share information

You type each project **once**, in `js/projects.js`.

- The **homepage** reads that list to build the gallery, the search and the filters.
- Every **project page** is the same file. It looks at the name of the folder it sits in
  (for example `projects/camou-poster/`) and shows the project with that `slug`.

So a project page never needs editing. If you fix a typo in `projects.js`,
the homepage and the project page both change.

Every project page has the same layout, always in this order:

1. **01 Original sketch**: your sketch, large
2. **02 Inside my workspace**: a screenshot of Photoshop (or other software), captioned "Digital workspace — Adobe Photoshop"
3. **03 Final output**: your final design, large. If there is a sketch, buttons let visitors switch
   between the final, a Before / After slider, and a side-by-side view.

Every image can be clicked to enlarge it. Previous / Next and Back to projects are on every page.

The **Type** filter is worked out from the category. The list that decides it is
`CATEGORY_TYPES` in `projects.js` (for example Poster → Print design). Add a line there when
you use a new category.

## 3. Open the site in VS Code

1. In VS Code choose **File → Open Folder…** and pick this `portfolio` folder.
2. Install the free extension **Live Server** (Extensions panel, search "Live Server").
3. Right-click `index.html` → **Open with Live Server**. The site opens in your browser
   and refreshes each time you save.

Double-clicking `index.html` also works, but Live Server behaves more like the real website.

## 4. Add one of your projects

**a. Prepare the images.** Export them as landscape JPG or WebP files, about 2000 px wide,
ideally under 500 KB each. Use short lowercase names with dashes:

```
images/projects/my-poster/final.jpg       required
images/projects/my-poster/sketch.jpg      optional: a photo or scan of your sketch
images/projects/my-poster/workspace.jpg   optional: a screenshot of Photoshop (or other software)
```

The site shows each image whole. It never crops or stretches it, and it reads the shape
of the image by itself.

**b. Add it to `js/projects.js`.** Copy a block, paste it into the list, and fill it in:

```js
{
  slug: 'my-poster',
  title: 'My poster',
  year: 2026,
  category: 'Poster',
  software: ['Adobe Photoshop'],
  description: 'One or two sentences about what the design is.',
  goal: '',      // optional, one short sentence
  result: '',    // optional, one short sentence
  images: {
    final: 'images/projects/my-poster/final.jpg',
    sketch: 'images/projects/my-poster/sketch.jpg',
    workspace: ''
  }
},
```

Leave anything you are not sure about as `''`. Empty text is hidden, never invented.

While you are building, a missing sketch or screenshot shows a box labeled "not added yet", so you
can see what is still missing. Before you publish, open `js/projects.js` and change
`var SHOW_PLACEHOLDERS = true;` to `false`. Missing sketches and screenshots are then simply left out
and the remaining steps are renumbered. A page with only a final image still looks complete.

If the sketch and the final are framed differently (different crop or angle), add
`aligned: false,` and the page shows them side by side instead of with the slider.

**c. Make its page.** Copy the folder `projects/_template` and rename the copy to the slug,
for example `projects/my-poster`. Do not change anything inside it.

Check it: open the homepage, find the project, click **View project**.

## 5. Your projects

The sample projects have been replaced by your three projects from Google Drive:
`moneyfesting-logo`, `brew-haven-graphics` and `camou-poster` (the samples are kept in
`../backups/portfolio-2026-11-01-sample-projects/`). The big Before & After on the homepage uses
`FEATURED.slug` in `projects.js`; any project with a sketch works.

## 6. Replace the [bracket] placeholders

Search with **Ctrl + Shift + F** (Mac: **Cmd + Shift + F**) for `[` and replace each
placeholder with your real information. They are in `index.html` and in the footer and
title of `projects/_template/index.html`. After changing the template, copy that file into
every project folder again. If a placeholder doesn't apply to you, delete it with its line.

## 7. Logo, photos and cover backgrounds

**Logo.** The site uses `images/logo/logo.jpg`, a small square copy cropped from `ICON LOGO.jpg`.
To change it, replace `logo.jpg` with another square image (about 192 × 192 px). It is shown as a
circle in the header, the mobile menu and the footer of every page.

**Your photo** appears twice on the homepage, both times as an oval with a green ring: large on the
intro cover and smaller in the welcome section below it. Each spot has two `<img>` lines: the one
with `class="photo-light"` shows in light mode, the one with `class="photo-dark"` in dark mode.
Only the photo for the current theme is downloaded. The site uses web-sized copies
(`profile-light-web.jpg`, `profile-dark-web.jpg`); your full-size originals stay next to them.

**Cover backgrounds.** Light mode uses `images/cover/cover-light.jpg`, dark mode `images/cover/cover-dark.jpg`.
To change one, replace that file. The gradients that keep the text readable are added in
`css/style.css` (search for INTRO COVER), so the pictures themselves are never edited.

**Colours.** The palette lives at the top of `css/style.css`: `--pine`, `--lime` and `--tea`.

## 8. Turn on the CV buttons

Put your PDF in `files/`, for example `files/cv-your-name.pdf`. In `index.html`, replace the two
disabled `<button …>` lines in the CV section with:

```html
<a class="btn btn-primary" href="files/cv-your-name.pdf" download>Download CV <span class="mono">PDF</span></a>
<a class="btn btn-outline" href="files/cv-your-name.pdf" target="_blank" rel="noopener">View CV Online <span aria-hidden="true">&nearr;</span></a>
```

Then delete the paragraph with `id="cv-status"`.

## 9. The contact form (Formspree)

The form sends through Formspree to the email on your Formspree account. The form address is
`https://formspree.io/f/xgaananp`, set in `js/home.js` (`FORMSPREE_ENDPOINT`) and as the form's
`action` in `index.html`, so it still works without JavaScript. The address is public by design;
it is not a password.

What is sent: `name`, `email`, `subject`, `message`, plus `_subject` (the email's subject line,
"Portfolio message: …") and `_gotcha` (the hidden spam trap). Formspree uses `email` as Reply-To,
so you can answer from Gmail directly.

To test:
1. Open the site through the local server (http://127.0.0.1:8765), not by double-clicking the file.
2. Fill in the form with your own second email address and send it. The button shows "Sending…",
   then "Message sent successfully!" appears and the form clears.
3. In the Formspree dashboard, open the form and check Submissions: the message should be listed.
4. In Gmail, look for an email from Formspree. Check Spam and Promotions the first time and mark it
   "Not spam". The very first submission may ask you to confirm the form by email.

If sending fails, the visitor's text stays in the form and the error says why.

## 10. Your live website and how to update it

The site is published with GitHub Pages from the `main` branch of the `Almarines_Ythan_portfolio` repository
(renamed from `portfolio`; the old `/portfolio/` address no longer serves the site):

- Website: `https://tantanannan.github.io/Almarines_Ythan_portfolio/`
- Repository: `https://github.com/tantanannan/Almarines_Ythan_portfolio`

All links are relative, so the site works under `/Almarines_Ythan_portfolio/` (or any other name).
The browser tab icon is in `images/favicon/`, made from `images/logo/ICON LOGO.jpg`. `.nojekyll` tells GitHub to serve
the files exactly as they are. `.gitignore` lists files that stay on this computer only (original
source images, the "put your file here" notes and `projects/_template`).

**To update the website later** (in VS Code: Terminal > New Terminal, inside this `portfolio` folder):

1. Make your change, then check it locally: run `python -m http.server 8765` and open
   http://127.0.0.1:8765. Press Ctrl+F5 to reload without the cache.
2. See what changed:

   ```
   git status
   ```

3. Save the change as a new version and upload it:

   ```
   git add -A
   git commit -m "Describe the change, e.g. Add new poster project"
   git push
   ```

4. Wait one or two minutes, then reload the live site with Ctrl+F5. The repository's
   **Actions** tab shows "pages build and deployment" with a green tick when it is live.

Before you push, check `git status`: only website files should be listed. Keep private files
(original certificates, the original CV, PSDs) outside this folder; `../private/` is the place.
To add a project, follow section 4: `projects/_template` is still here on your computer.
If you ever change the CV, make the public copy without your street address before uploading.

## 11. Analytics (GoatCounter, free)

Visits are counted with GoatCounter's free hosted service: no cookies, no IP addresses or visitor IDs
stored, only anonymous totals. A reload or a return to the same page within 8 hours is not counted again.

- **Tracking:** `js/site.js` loads GoatCounter's `count.js` once on every page (homepage, project
  pages, Views page). Your site address is the `GC` line in that file. Visits from your own
  computer (localhost, or opening the file directly) are never counted.
- **Public numbers:** the footer of every page and the Views page (`analytics.html`) show
  **Recorded Portfolio Views**, GoatCounter's site-wide `TOTAL`. Nothing else is public.
  The total is asked for as `start=2026-11-03` (when tracking began) to an `end` date two days ahead,
  worked out from today's date (`TRACKING_START` and `totalURL()` in `js/site.js`). The date range gives
  a fresh GoatCounter cache entry every day: GoatCounter can keep serving an old count for up to 12 hours,
  so the total updates at least daily (at 00:00 UTC, 8:00 AM in the Philippines), usually every few hours.
- **Your private dashboard:** https://almarinesythan.goatcounter.com (sign in with your
  GoatCounter email and password). It is also on the Views page under **Owner Analytics**.
  Bookmark it; it is not linked anywhere as an admin link.
- **GoatCounter settings that must stay this way** (Settings on your dashboard):
  - "Allow adding visitor counts on your website": **on** (the public total needs it).
  - "Sites that can embed GoatCounter": `https://tantanannan.github.io` (for Owner Analytics).
  - "Dashboard viewable by": **logged in users only**. Never make an access token and never put
    one in the site: anyone could read it.
- **Leave out your own visits:** open
  https://tantanannan.github.io/Almarines_Ythan_portfolio/#toggle-goatcounter once in each browser
  you use. Do it again to undo.

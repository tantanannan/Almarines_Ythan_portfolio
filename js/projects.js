/* ============================================================
   projects.js — THE ONLY FILE YOU EDIT TO ADD OR CHANGE PROJECTS
   Used by the homepage gallery AND every project page.
   ============================================================

   HOW TO ADD A PROJECT (see README.md for pictures-free steps)
   1. Put your images in a new folder:  images/projects/your-project/
   2. Copy one { ... } block below, paste it into the list, and fill it in.
   3. Copy the folder projects/_template/ and rename the copy to the
      same slug, e.g. projects/your-project/   (nothing inside needs editing)

   Rules
   - Leave a sentence as '' when you are not sure. Empty text is hidden.
   - sketch and workspace are optional. Leave them '' if you don't have them
     (see SHOW_PLACEHOLDERS near the bottom of this file).
   - Image paths start from the website's main folder, e.g. 'images/projects/...'.
   - Delete the  sample: true  line (or the whole sample block) once a project is real.

   {
     slug: 'your-project',                 // lowercase-with-dashes, same as the folder name
     title: 'Your project title',
     year: 2026,
     category: 'Poster',                   // the Type filter is worked out from this (see CATEGORY_TYPES)
     software: ['Adobe Photoshop'],        // one or more, e.g. ['Adobe Illustrator', 'Adobe Photoshop']
     description: 'One or two sentences.',
     goal: '',                             // optional: Design goal, one short sentence
     result: '',                           // optional: Final result, one short sentence
     images: {
       final: 'images/projects/your-project/final.jpg',
       sketch: 'images/projects/your-project/sketch.jpg',      // optional
       workspace: 'images/projects/your-project/workspace.jpg' // optional
     }
   },

   The description is shown on the gallery plate and as "About the project" on the project page.

   Optional extras (only if needed):
     aligned: false   your sketch and final are framed differently, so show them side by side, not with the slider
     type: 'Print'    override the Type worked out from the category
     medium: 'Hand-drawn'  shown instead of Software when a piece was made without software

   A drawing on its own: give only images.sketch and leave final and workspace ''. The gallery plate then
   shows the drawing, and its page shows just the one step.
*/

var PROJECTS = [
  /* Your three projects from Google Drive (CEEL 3-IT11). Titles, years, categories and software come
     from the files themselves: the names on the artwork, the dates on the sketches and screenshots,
     your Drive folder names, and the app shown in each workspace screenshot. Check them and edit freely.
     category is the course term (Prelim, Midterm, Finals); type is the kind of design shown on each card.
     Keep the list in term order: the Category filter lists terms in the order they first appear here. */
  {
    slug: 'pina-prosperity',
    title: 'Piña Prosperity', year: 2026, category: 'Prelim', type: 'Drawing', software: [], medium: 'Hand-drawn',
    description: 'Activity 1: a hand-drawn, coloured pineapple titled “Piña Prosperity”, with small bows on its leaves.',
    goal: '', result: '', // optional: one sentence each for the design goal and the result
    images: {
      final: '',      // a drawing on its own: no workspace or final output
      sketch: 'images/projects/pina-prosperity/sketch.jpg', // Activity 1, Aug 4 2026 (signature covered)
      workspace: ''
    }
  },
  {
    slug: 'moneyfesting-logo',
    title: 'Moneyfesting logo set', year: 2026, category: 'Prelim', type: 'Brand design', software: ['Adobe Photoshop'],
    description: 'Logo set for moneyfesting: a gold coin with a green shamrock, in badge, horizontal, icon and vertical versions.',
    goal: '', result: '', // optional: one sentence each for the design goal and the result
    aligned: false,        // the sketch sheet and the logo are framed differently, so they show side by side
    images: {
      final: 'images/projects/moneyfesting-logo/final.jpg',
      sketch: 'images/projects/moneyfesting-logo/sketch.jpg',
      workspace: 'images/projects/moneyfesting-logo/workspace.png'
    }
  },
  {
    slug: 'brew-haven-graphics',
    title: 'Brew Haven marketing graphics', year: 2026, category: 'Midterm', type: 'Digital design', software: ['Adobe Photoshop', 'Canva'],
    description: 'Logo and social media post for Brew Haven, a cozy coffee brand with the tagline “Sip the season”.',
    goal: '', result: '', // optional: one sentence each for the design goal and the result
    aligned: false,
    images: {
      final: 'images/projects/brew-haven-graphics/final.jpg',
      sketch: 'images/projects/brew-haven-graphics/sketch.jpg',
      workspace: 'images/projects/brew-haven-graphics/workspace.png'
    }
  },
  {
    slug: 'camou-poster',
    title: 'CAMOU typography poster', year: 2026, category: 'Midterm', type: 'Print design', software: ['Canva'],
    description: 'Typography poster for CAMOU for men, built around the line “Blend in. Stand out.”',
    goal: '', result: '', // optional: one sentence each for the design goal and the result
    images: {
      final: 'images/projects/camou-poster/final.jpg',
      sketch: 'images/projects/camou-poster/sketch.jpg',
      workspace: 'images/projects/camou-poster/workspace.png'
    },
    /* Matched landscape pair for the before & after slider: the same 1536 x 864 frame, with the
       sketch's lettering scaled (not stretched) to the poster's lettering width and centred on it */
    compare: {
      sketch: 'images/projects/camou-poster/compare-sketch.jpg',
      final: 'images/projects/camou-poster/compare-final.jpg'
    }
  },
  {
    slug: 'portfolio-website',
    title: 'Portfolio website', year: 2026, category: 'Finals', type: 'Web design', software: ['Visual Studio Code'],
    description: 'This website, from a paper prototype of its pages to the finished site built in HTML, CSS and JavaScript.',
    goal: '', result: '', // optional: one sentence each for the design goal and the result
    aligned: false,
    images: {
      final: 'images/projects/portfolio-website/final.jpg',         // the homepage, captured at 1440 x 900
      sketch: 'images/projects/portfolio-website/sketch.jpg',       // "Portfolio Paper Prototyping", Activity 6
      workspace: 'images/projects/portfolio-website/workspace.png'  // index.html open in Visual Studio Code
    }
  }
];

/* Type filter: each category belongs to one type. Add a line when you use a new category.
   A category that is not listed shows as "Other". */
var CATEGORY_TYPES = {
  'Branding': 'Brand design',
  'Logo': 'Brand design',
  'Poster': 'Print design',
  'Print': 'Print design',
  'Packaging': 'Print design',
  'Social media': 'Digital design',
  'UI design': 'Digital design',
  'Web design': 'Digital design',
  'Illustration': 'Illustration',
  'Photo editing': 'Photo editing'
};

/* While you build the site, project pages show a labeled box where a sketch or workspace
   screenshot is still missing, so you can see what to add.
   Set this to false before you publish: missing optional images are then simply left out. */
var SHOW_PLACEHOLDERS = false; // true shows labeled boxes for missing images while you build

/* The big Before & After on the homepage. Use the slug of a project that has a sketch. */
var FEATURED = {
  slug: 'camou-poster', // any project with a sketch; one with a `compare` pair gets the slider
  title: 'From sketch to final',
  text: '' // optional: one sentence about this project (the slider already explains how to use it)
};


/* ------------------------------------------------------------
   Helpers shared by the homepage and the project pages.
   You do not need to edit anything below this line.
   ------------------------------------------------------------ */
var Portfolio = (function () {
  // Pages tell us how far they are from the main folder: "" on the homepage, "../../" on project pages.
  var root = document.body.getAttribute('data-root') || '';

  function typeOf(p) { return p.type || CATEGORY_TYPES[p.category] || 'Other'; }
  function asset(path) { return path ? root + path : ''; }
  function pageUrl(p) { return root + 'projects/' + p.slug + '/index.html'; }
  function find(slug) { for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].slug === slug) return PROJECTS[i]; return null; }
  function plateNo(p) { var n = PROJECTS.indexOf(p) + 1; return (n < 10 ? '0' : '') + n; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ratioNum(r) { var p = String(r).split('/'); return (+p[0]) / (+p[1] || 1); }
  function setRatio(el, r) { el.style.setProperty('--ratio', r); el.style.setProperty('--r', ratioNum(r)); }
  /* An image sets the shape of its frame once it loads, so no sizes need typing in */
  function autoRatio(img, els) {
    if (!img || img.tagName !== 'IMG') return;
    function apply() { if (img.naturalWidth) els.forEach(function (el) { setRatio(el, img.naturalWidth + ' / ' + img.naturalHeight); }); }
    if (img.complete) apply(); else img.addEventListener('load', apply);
  }
  var XSVG = '<svg class="x" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L100 100M100 0L0 100" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>';
  /* A real image, or a labeled placeholder frame when the path is empty */
  function media(src, alt, label, lazy) {
    if (src) return '<img src="' + esc(asset(src)) + '" alt="' + esc(alt) + '"' + (lazy ? ' loading="lazy"' : '') + ' decoding="async">';
    return '<div class="frame" role="img" aria-label="' + esc(label) + ' placeholder">' + XSVG + '<span class="frame-label mono">' + esc(label) + '</span></div>';
  }

  /* The two images the before & after uses. A project can give a matched pair in `compare`
     (same frame, artwork lined up), which always works with the slider; otherwise its own
     sketch and final are used, side by side when `aligned: false`. */
  function comparePair(p) {
    if (p.compare && p.compare.sketch && p.compare.final) return { sketch: p.compare.sketch, final: p.compare.final, aligned: true };
    return { sketch: p.images.sketch, final: p.images.final, aligned: p.aligned !== false };
  }

  return { root: root, typeOf: typeOf, asset: asset, pageUrl: pageUrl, find: find, plateNo: plateNo, esc: esc,
    ratioNum: ratioNum, setRatio: setRatio, autoRatio: autoRatio, media: media, comparePair: comparePair };
})();

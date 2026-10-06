/* The site bar: the one list of Accelerate's pages, and the badges every page draws from it.

   A page adds site/nav.css and this file, and puts the element in its header: at the right end
   of its top bar, or in a strip of its own above a full bar:
     <div class="top-in"><b>Page</b> ... <nav class="sn-top" data-site-nav data-here="coding" data-base=""></nav></div>
     <div class="sn-strip"><nav class="sn-top" data-site-nav data-here="alaap"></nav></div>
   (The tracker's overview puts it in the page instead, as a grid: class sn-grid, styled in index.html.)
   data-here   this page's key (or its href), marked and not a link
   data-base   the path back to the site root: "" at the root, "../" from interviews/
   Every other page opens in a new tab. A page that renders its header with script can add the
   element at any time: it is drawn when it appears. */
(function () {
  "use strict";

  /* Lucide icons (lucide-static 0.469.0, ISC), the same markup as figures/icons.js,
     copied so a page without icons.js still draws the badges. */
  var ICON = {
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/> <rect x="2" y="16" width="6" height="6" rx="1"/> <rect x="9" y="2" width="6" height="6" rx="1"/> <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/> <path d="M12 12V8"/>',
    code: '<polyline points="16 18 22 12 16 6"/> <polyline points="8 6 2 12 8 18"/>',
    "layout-grid": '<rect width="7" height="7" x="3" y="3" rx="1"/> <rect width="7" height="7" x="14" y="3" rx="1"/> <rect width="7" height="7" x="14" y="14" rx="1"/> <rect width="7" height="7" x="3" y="14" rx="1"/>',
    "audio-waveform": '<path d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"/>',
    "message-square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/> <path d="M15 5.764v15"/> <path d="M9 3.236v15"/>'
  };

  /* label: the page's name (its title, and the hover text); short: the word on the badge */
  /* The public site (tools/build_public.py sets window.SITE_PUBLIC first) has its own home and
     list. The build also cuts everything between the local-only comments out of its copy. */
  var PUBLIC = !!window.SITE_PUBLIC;
  var HOME = PUBLIC ? { key: "home", href: "index.html", label: "Accelerate, the toolkit's home", short: "Home" }
    : { key: "tracker", href: "index.html", label: "Accelerate tracker", short: "Accelerate" };
  var PAGES = [
    { key: "baseline", href: "BASELINE.html", label: "Baseline, a map of the fields", short: "Baseline", icon: ICON.map },
    { key: "guide", href: "SYSTEM%20DESIGN.html", label: "System design guide", short: "System design", icon: ICON.network },
    { key: "coding", href: "CODING.html", label: "Algorithms and coding, with its one-screen cheat sheet", short: "Coding", icon: ICON.code },
    { key: "projects", href: "PROJECTS.html", label: "Projects, how each one works", short: "Projects", icon: ICON["layout-grid"] }
  ];
  if (PUBLIC) {
    PAGES.push({ key: "dl", href: "DEEP-LEARNING.html", label: "Deep learning from scratch", short: "Deep learning", icon: ICON["audio-waveform"] });
  }
  /* local-only */
  else {
    PAGES.push(
      { key: "alaap", href: "ALAAP.html", label: "Alaap and TrenTorch", short: "Alaap", icon: ICON["audio-waveform"] },
      { key: "interviews", href: "INTERVIEWS.html", label: "Interview loops", short: "Interviews", icon: ICON["message-square"] });
    /* A private script (private/site.js, gitignored) may have listed pages of its own before this
       file ran: each goes in before the page named by its "before" key, or at the end. */
    (window.SITE_PAGES || []).forEach(function (p) {
      var at = PAGES.map(function (q) { return q.key; }).indexOf(p.before);
      PAGES.splice(at < 0 ? PAGES.length : at, 0, p);
    });
  }
  /* end local-only */
  window.SITE_HOME = HOME;
  window.SITE_PAGES = PAGES;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function badge(p, face, here, base) {
    if (here === p.key || here === p.href) {
      return '<span class="sn-b sn-here sn-' + p.key + '" aria-current="page" title="' + esc(p.label) + ', this page">' +
        face + esc(p.short) + "</span>";
    }
    return '<a class="sn-b sn-' + p.key + '" href="' + esc(base + p.href) + '" target="_blank" rel="noopener" title="' + esc(p.label) + '">' +
      face + esc(p.short) + '<span class="sn-sr">, opens in a new tab</span></a>';
  }

  function draw(nav) {
    nav.setAttribute("data-drawn", "1");
    var here = nav.getAttribute("data-here") || "", base = nav.getAttribute("data-base") || "";
    nav.classList.add("site-nav");
    if (!nav.getAttribute("aria-label")) { nav.setAttribute("aria-label", "Accelerate pages"); }
    nav.innerHTML = badge(HOME, '<img src="' + esc(base) + 'brand/accelerate.svg" width="16" height="16" alt="">', here, base) +
      PAGES.map(function (p) {
        return badge(p, '<svg viewBox="0 0 24 24" aria-hidden="true">' + p.icon + "</svg>", here, base);
      }).join("");
  }

  function drawAll() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-site-nav]:not([data-drawn])"), draw);
  }
  function start() {
    drawAll();
    new MutationObserver(drawAll).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

/* AI Engineering from Scratch lessons load from raw.githubusercontent.com, which some networks block. When a
   local copy of the course is running (study.cmd serves a clone on http://localhost:8010), lesson links open
   there instead: probed once at load, rewritten at click time, so every page and every rendered list is covered.
   Off on the public site. */
(function () {
  if (window.SITE_PUBLIC || !window.fetch) { return; }
  var LOCAL = "http://localhost:8010/site/lesson.html", up = false;
  fetch("http://localhost:8010/site/data.js", { mode: "no-cors", cache: "no-store" }).then(function () { up = true; }, function () {});
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="https://aiengineeringfromscratch.com/lesson"]');
    if (!a || !up) { return; }
    var href = a.getAttribute("href");
    a.setAttribute("href", LOCAL + href.slice(href.indexOf("?")));
  }, true);
})();

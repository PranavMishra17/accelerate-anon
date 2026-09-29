/* The site bar: the one list of Accelerate's pages, and the badges every page draws from it.

   A page adds site/nav.css and this file, and puts the element right of its title:
     <div class="sn-titlerow"><h1>Title</h1><nav data-site-nav data-here="coding" data-base=""></nav></div>
   data-here   this page's key (or its href), marked and not a link
   data-base   the path back to the site root: "" at the root, "../" from interviews/
   Every other page opens in a new tab. A page that renders its title with script can add the
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
    bot: '<path d="M12 8V4H8"/> <rect width="16" height="12" x="4" y="8" rx="2"/> <path d="M2 14h2"/> <path d="M20 14h2"/> <path d="M15 13v2"/> <path d="M9 13v2"/>',
    "message-square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
  };

  /* label: the page's name (its title, and the hover text); short: the word on the badge */
  var HOME = { key: "tracker", href: "index.html", label: "Accelerate tracker", short: "Accelerate" };
  var PAGES = [
    { key: "guide", href: "SYSTEM%20DESIGN.html", label: "System design guide", short: "System design", icon: ICON.network },
    { key: "coding", href: "CODING.html", label: "Algorithms and coding", short: "Coding", icon: ICON.code },
    { key: "cheatsheet", href: "CHEATSHEET.html", label: "Coding cheat sheet", short: "Cheat sheet", icon: ICON["layout-grid"] },
    { key: "alaap", href: "ALAAP.html", label: "Alaap and TrenTorch", short: "Alaap", icon: ICON["audio-waveform"] },
    { key: "alfred", href: "ALFRED.html", label: "alfred_", short: "alfred_", icon: ICON.bot },
    { key: "interviews", href: "INTERVIEWS.html", label: "Interview loops", short: "Interviews", icon: ICON["message-square"] }
  ];
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

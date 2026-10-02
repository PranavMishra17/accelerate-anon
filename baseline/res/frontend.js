/* What to read and watch for each topic in the frontend field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("frontend", {
 "rendering-pipeline": [
  {
   "kind": "read",
   "req": true,
   "label": "Chrome for Developers: inside look at modern web browser, part 3, the renderer",
   "url": "https://developer.chrome.com/blog/inside-browser-part3",
   "m": 15,
   "why": "Parse, style, layout, paint, composite: what the renderer does with your page."
  }
 ],
 "event-loop": [
  {
   "kind": "video",
   "req": true,
   "label": "What the heck is the event loop anyway?",
   "url": "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
   "m": 27,
   "why": "The classic visual walk-through of the call stack, task queue and render.",
   "yt": {
    "id": "8aGhZQkoFbQ",
    "ch": "JSConf"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Jake Archibald: tasks, microtasks, queues and schedules",
   "url": "https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/",
   "m": 20,
   "why": "Why promises run before timers, with animated examples."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Jake Archibald: In the Loop",
   "url": "https://www.youtube.com/watch?v=cCOL7MC4Pl0",
   "m": 36,
   "why": "The browser event loop with rendering in it; watch the first 20 minutes.",
   "yt": {
    "id": "cCOL7MC4Pl0",
    "ch": "JSConf"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "web.dev: optimize long tasks",
   "url": "https://web.dev/articles/optimize-long-tasks",
   "m": 15,
   "why": "How to stop one task from freezing input and paint."
  }
 ],
 "css-layout": [
  {
   "kind": "video",
   "req": true,
   "label": "CSS Flexbox in 100 seconds",
   "url": "https://www.youtube.com/watch?v=K74l26pE4YA",
   "m": 2,
   "why": "Main axis, cross axis and the properties that move items on them.",
   "yt": {
    "id": "K74l26pE4YA",
    "ch": "Fireship"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "CSS Grid in 100 seconds",
   "url": "https://www.youtube.com/watch?v=uuOXPWCh-6o",
   "m": 2,
   "why": "Rows, columns and areas, and when to reach for grid over flex.",
   "yt": {
    "id": "uuOXPWCh-6o",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Josh W. Comeau: an interactive guide to Flexbox",
   "url": "https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/",
   "m": 25,
   "why": "Play with every flexbox property until the model is clear."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Josh W. Comeau: an interactive guide to CSS Grid",
   "url": "https://www.joshwcomeau.com/css/interactive-guide-to-grid/",
   "m": 25,
   "why": "The same treatment for grid."
  }
 ],
 "components": [
  {
   "kind": "video",
   "req": true,
   "label": "React in 100 seconds",
   "url": "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
   "m": 3,
   "why": "Components, props, state and re-rendering in one pass.",
   "yt": {
    "id": "Tn6-PIqc4UM",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "React docs: Thinking in React",
   "url": "https://react.dev/learn/thinking-in-react",
   "m": 20,
   "why": "Break a screen into components and decide where state lives."
  },
  {
   "kind": "read",
   "req": false,
   "label": "React docs: you might not need an effect",
   "url": "https://react.dev/learn/you-might-not-need-an-effect",
   "m": 25,
   "why": "The most common misuse of effects and what to do instead."
  }
 ],
 "state-management": [
  {
   "kind": "read",
   "req": true,
   "label": "TanStack Query docs: overview, server state against client state",
   "url": "https://tanstack.com/query/latest/docs/framework/react/overview",
   "m": 10,
   "why": "Why data from a server is a different kind of state."
  }
 ],
 "routing-data-fetching": [
  {
   "kind": "read",
   "req": true,
   "label": "React Router docs: data loading",
   "url": "https://reactrouter.com/start/framework/data-loading",
   "m": 10,
   "why": "Loaders fetch a route's data before it renders."
  }
 ],
 "design-systems": [
  {
   "kind": "read",
   "req": true,
   "label": "Brad Frost: Atomic Design, chapter 2",
   "url": "https://atomicdesign.bradfrost.com/chapter-2/",
   "m": 20,
   "why": "Atoms, molecules and organisms as a way to build a system."
  }
 ],
 "rendering-strategies": [
  {
   "kind": "read",
   "req": true,
   "label": "web.dev: rendering on the web",
   "url": "https://web.dev/articles/rendering-on-the-web",
   "m": 25,
   "why": "CSR, SSR, static and hybrids compared on cost and speed."
  }
 ],
 "hydration": [
  {
   "kind": "read",
   "req": true,
   "label": "web.dev: rendering on the web, the hydration and streaming sections",
   "url": "https://web.dev/articles/rendering-on-the-web",
   "m": 25,
   "why": "What hydration costs and how streaming and partial hydration reduce it."
  },
  {
   "kind": "read",
   "req": false,
   "label": "React docs: hydrateRoot",
   "url": "https://react.dev/reference/react-dom/client/hydrateRoot",
   "m": 10,
   "why": "How React attaches to server HTML and what a mismatch is."
  }
 ],
 "server-components": [
  {
   "kind": "read",
   "req": true,
   "label": "React docs: Server Components reference",
   "url": "https://react.dev/reference/rsc/server-components",
   "m": 20,
   "why": "What runs only on the server and what crosses to the client."
  }
 ],
 "web-vitals": [
  {
   "kind": "read",
   "req": true,
   "label": "web.dev: Web Vitals",
   "url": "https://web.dev/articles/vitals",
   "m": 10,
   "why": "The three metrics, their thresholds and how they are measured."
  },
  {
   "kind": "read",
   "req": false,
   "label": "web.dev: Interaction to Next Paint",
   "url": "https://web.dev/articles/inp",
   "m": 15,
   "why": "The responsiveness metric in detail."
  }
 ],
 "bundles": [
  {
   "kind": "video",
   "req": true,
   "label": "Vite in 100 seconds",
   "url": "https://www.youtube.com/watch?v=KCrXgy8qtjM",
   "m": 3,
   "why": "Dev server on native modules, production build with a bundler.",
   "yt": {
    "id": "KCrXgy8qtjM",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "web.dev: reduce JavaScript payloads with code splitting",
   "url": "https://web.dev/articles/reduce-javascript-payloads-with-code-splitting",
   "m": 10,
   "why": "Split the bundle so a page loads only what it needs."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Vite docs: why Vite",
   "url": "https://vite.dev/guide/why",
   "m": 10,
   "why": "The problem with bundling in dev and how Vite avoids it."
  }
 ],
 "accessibility": [
  {
   "kind": "keep",
   "src": "course",
   "req": true,
   "label": "web.dev: Learn Accessibility, the ARIA, focus and testing modules",
   "url": "https://web.dev/learn/accessibility",
   "m": 60,
   "why": "A structured course; do the ARIA, focus and testing modules."
  },
  {
   "kind": "read",
   "req": false,
   "label": "W3C: ARIA Authoring Practices Guide, patterns for common widgets",
   "url": "https://www.w3.org/WAI/ARIA/apg/",
   "m": 20,
   "why": "Keyboard and ARIA patterns for dialogs, tabs, menus and more."
  }
 ],
 "testing-frontend": [
  {
   "kind": "read",
   "req": true,
   "label": "Testing Library: guiding principles",
   "url": "https://testing-library.com/docs/guiding-principles",
   "m": 5,
   "why": "Test the way a user uses the page, not the implementation."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Playwright docs: getting started",
   "url": "https://playwright.dev/docs/intro",
   "m": 10,
   "why": "Writing and running a first browser test."
  }
 ],
 "web-apis": [
  {
   "kind": "read",
   "req": true,
   "label": "MDN: using Web Workers",
   "url": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers",
   "m": 15,
   "why": "Moving work off the main thread and talking to it by messages."
  }
 ],
 "browser-security": [
  {
   "kind": "video",
   "req": true,
   "label": "Cracking websites with Cross Site Scripting",
   "url": "https://www.youtube.com/watch?v=L5l9lSnNMxg",
   "m": 9,
   "why": "A working XSS attack shown step by step.",
   "yt": {
    "id": "L5l9lSnNMxg",
    "ch": "Computerphile"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "OWASP: cross-site scripting prevention cheat sheet",
   "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
   "m": 20,
   "why": "Encode output by context; the rules to follow."
  },
  {
   "kind": "read",
   "req": false,
   "label": "MDN: Content Security Policy guide",
   "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP",
   "m": 15,
   "why": "The header that limits where scripts may come from."
  }
 ],
 "cors-csrf": [
  {
   "kind": "video",
   "req": true,
   "label": "CORS in 100 seconds",
   "url": "https://www.youtube.com/watch?v=4KHiSt0oLJ0",
   "m": 3,
   "why": "What the same-origin policy blocks and how a server opts in.",
   "yt": {
    "id": "4KHiSt0oLJ0",
    "ch": "Fireship"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "Cross Site Request Forgery",
   "url": "https://www.youtube.com/watch?v=vRBihr41JTo",
   "m": 10,
   "why": "How another site can make your browser send an authenticated request.",
   "yt": {
    "id": "vRBihr41JTo",
    "ch": "Computerphile"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "MDN: cross-origin resource sharing (CORS) guide",
   "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS",
   "m": 20,
   "why": "Preflight, headers and credentials in full."
  },
  {
   "kind": "read",
   "req": false,
   "label": "OWASP: cross-site request forgery prevention cheat sheet",
   "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
   "m": 20,
   "why": "Tokens and SameSite cookies as defences."
  }
 ]
});

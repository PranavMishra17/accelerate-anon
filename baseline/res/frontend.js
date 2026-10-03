/* What to read and watch for each topic in the frontend field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("frontend", {
 "rendering-pipeline": [
  {
   "kind": "video",
   "req": true,
   "label": "How browsers render websites (the step-by-step process)",
   "url": "https://www.youtube.com/watch?v=NBAjlYb6jIs",
   "m": 8,
   "yt": {
    "id": "NBAjlYb6jIs",
    "ch": "DevJourney"
   },
   "why": "The path from HTML and CSS to DOM, CSSOM, layout, paint and composite in one sitting."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Critical rendering path: crash course on web performance",
   "url": "https://www.youtube.com/watch?v=PkOBnYxqj3k",
   "m": 42,
   "yt": {
    "id": "PkOBnYxqj3k",
    "ch": "Ilya Grigorik"
   },
   "why": "The classic talk on how scripts and CSS block rendering; watch the first half."
  },
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
   "kind": "video",
   "req": true,
   "label": "React Query makes writing React code 200% better",
   "url": "https://www.youtube.com/watch?v=lVLz_ASqAio",
   "m": 14,
   "yt": {
    "id": "lVLz_ASqAio",
    "ch": "Web Dev Simplified"
   },
   "why": "Shows why server state wants a cache with refetching and invalidation, not a store."
  },
  {
   "kind": "video",
   "req": false,
   "label": "The state of state management in React",
   "url": "https://www.youtube.com/watch?v=qqqyUTTS-9g",
   "m": 26,
   "yt": {
    "id": "qqqyUTTS-9g",
    "ch": "PedroTech"
   },
   "why": "Compares local state, context and a small store so you can say where each kind of state lives."
  },
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
   "kind": "video",
   "req": true,
   "label": "React Router in depth #6: loaders",
   "url": "https://www.youtube.com/watch?v=K-bxVELldCc",
   "m": 13,
   "yt": {
    "id": "K-bxVELldCc",
    "ch": "Net Ninja"
   },
   "why": "Route loaders load data before render, which is how a router avoids fetch-in-component waterfalls."
  },
  {
   "kind": "video",
   "req": false,
   "label": "The best data fetching pattern in React",
   "url": "https://www.youtube.com/watch?v=iO6px_wz1oc",
   "m": 17,
   "yt": {
    "id": "iO6px_wz1oc",
    "ch": "Cosden Solutions"
   },
   "why": "Contrasts fetching in effects with route-level and cached patterns."
  },
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
   "kind": "video",
   "req": true,
   "label": "Tokens, variables, and styles: introduction to design systems",
   "url": "https://www.youtube.com/watch?v=JyCmacSyDY4",
   "m": 14,
   "yt": {
    "id": "JyCmacSyDY4",
    "ch": "Figma"
   },
   "why": "Explains design tokens as named values that let a theme change in one place."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Brad Frost: is atomic design dead?",
   "url": "https://www.youtube.com/watch?v=PK_PICNTgAg",
   "m": 37,
   "yt": {
    "id": "PK_PICNTgAg",
    "ch": "Hatch Conference"
   },
   "why": "Brad Frost on atoms to pages and how tokens and components fit it today."
  },
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
   "kind": "video",
   "req": true,
   "label": "What do CSR, SSR, SSG and ISR even mean",
   "url": "https://www.youtube.com/watch?v=p02AIAoImzU",
   "m": 14,
   "yt": {
    "id": "p02AIAoImzU",
    "ch": "Web Dev Simplified"
   },
   "why": "Clear side-by-side of where HTML is made and what each choice costs."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is CSR, SSR, SSG, ISR? Rendering strategies explained",
   "url": "https://www.youtube.com/watch?v=VDqEg0IoSIs",
   "m": 21,
   "yt": {
    "id": "VDqEg0IoSIs",
    "ch": "Shruti Kapoor"
   },
   "why": "A second pass with the trade-offs and when to pick each."
  },
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
   "kind": "video",
   "req": true,
   "label": "Hydration explained",
   "url": "https://www.youtube.com/watch?v=kZG3izJu7qE",
   "m": 5,
   "yt": {
    "id": "kZG3izJu7qE",
    "ch": "Awesome"
   },
   "why": "Shows why server HTML looks ready but ignores clicks until hydration attaches handlers."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Streaming server rendering with Suspense",
   "url": "https://www.youtube.com/watch?v=pj5N-Khihgc",
   "m": 19,
   "yt": {
    "id": "pj5N-Khihgc",
    "ch": "React Conf"
   },
   "why": "The React team on streaming the shell first and hydrating pieces as they arrive."
  },
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
   "kind": "video",
   "req": true,
   "label": "React Server Components change everything",
   "url": "https://www.youtube.com/watch?v=rGPpQdbDbwo",
   "m": 16,
   "yt": {
    "id": "rGPpQdbDbwo",
    "ch": "Web Dev Simplified"
   },
   "why": "Server and client components, what ships to the browser and what stays on the server."
  },
  {
   "kind": "video",
   "req": false,
   "label": "And now you understand React Server Components",
   "url": "https://www.youtube.com/watch?v=pOo7x8OiAec",
   "m": 22,
   "yt": {
    "id": "pOo7x8OiAec",
    "ch": "React Conf"
   },
   "why": "Kent C. Dodds builds up the model from first principles."
  },
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
   "kind": "video",
   "req": true,
   "label": "What are Core Web Vitals? Explained in 7 minutes",
   "url": "https://www.youtube.com/watch?v=pTswmgVWSH8",
   "m": 8,
   "yt": {
    "id": "pTswmgVWSH8",
    "ch": "Sematext"
   },
   "why": "LCP, INP and CLS with their thresholds and what each one measures."
  },
  {
   "kind": "video",
   "req": false,
   "label": "How to optimize web responsiveness with Interaction to Next Paint",
   "url": "https://www.youtube.com/watch?v=KZ1kxzsJZ5g",
   "m": 16,
   "yt": {
    "id": "KZ1kxzsJZ5g",
    "ch": "Chrome for Developers"
   },
   "why": "The Chrome team on what INP counts and how to bring it under 200 ms."
  },
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
   "kind": "video",
   "req": true,
   "label": "Web accessibility tutorial: keyboard navigation, ARIA, contrast, screen readers",
   "url": "https://www.youtube.com/watch?v=VyWRmepESoQ",
   "m": 24,
   "yt": {
    "id": "VyWRmepESoQ",
    "ch": "RoadsideCoder"
   },
   "why": "Covers the core checks: keyboard access, labels, contrast and ARIA."
  },
  {
   "kind": "video",
   "req": false,
   "label": "ARIA HTML tutorial: what is ARIA and why it is important",
   "url": "https://www.youtube.com/watch?v=0hqhAIjE_8I",
   "m": 14,
   "yt": {
    "id": "0hqhAIjE_8I",
    "ch": "DesignCourse"
   },
   "why": "When native HTML is enough and when ARIA patches the accessibility tree."
  },
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
   "kind": "video",
   "req": true,
   "label": "What is React Testing Library?",
   "url": "https://www.youtube.com/watch?v=JKOwJUM4_RM",
   "m": 8,
   "yt": {
    "id": "JKOwJUM4_RM",
    "ch": "Syntax"
   },
   "why": "Why tests query by role and text and act like a user rather than touch implementation."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is Playwright? Introduction, features and demo",
   "url": "https://www.youtube.com/watch?v=wGr5rz8WGCE",
   "m": 13,
   "yt": {
    "id": "wGr5rz8WGCE",
    "ch": "Testopic"
   },
   "why": "End-to-end tests in a real browser, with auto-waiting and cross-browser runs."
  },
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
   "kind": "video",
   "req": true,
   "label": "Web Workers vs Service Workers: what is the real difference",
   "url": "https://www.youtube.com/watch?v=Iz5f3ctn1W8",
   "m": 7,
   "yt": {
    "id": "Iz5f3ctn1W8",
    "ch": "Monsterlessons Academy"
   },
   "why": "Separates the off-thread worker from the network-proxy worker used for offline."
  },
  {
   "kind": "video",
   "req": false,
   "label": "IndexedDB: what is it, and when you should choose it",
   "url": "https://www.youtube.com/watch?v=-AzFQN9Vp7k",
   "m": 10,
   "yt": {
    "id": "-AzFQN9Vp7k",
    "ch": "WebDevLog"
   },
   "why": "Where IndexedDB sits next to cookies and localStorage."
  },
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

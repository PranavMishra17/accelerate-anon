BASELINE.field({
  id: "frontend", name: "Frontend engineering", short: "Frontend", layer: "Building",
  ink: "#8C4A2F", inkDark: "#E0A383",
  lede: "Frontend engineering builds the part of software that runs in the browser: turning code and data into pixels, making them respond to people, and keeping that fast, accessible and secure on any device.",
  overview: [
    "Frontend engineers build web interfaces: pages, forms, dashboards and whole applications that run in the browser. The work spans HTML for structure, CSS for layout and JavaScript or TypeScript for behaviour, almost always inside a framework. Titles include frontend engineer, UI engineer, design engineer (closer to design, often owning the component library) and web performance or platform engineer. A typical day is a new screen built from the design system, a bug that shows only in Safari, a slow interaction found in field data, or an accessibility fix.",
    "It sits between design and the **backend**: it consumes APIs, and since server rendering returned it often runs on servers too, which blurs the line into full-stack. **Mobile** shares its ideas (components, state, declarative UI), and React Native shares the code. In 2026 React is the default, with Next.js the most used framework on top of it, and Vue, Svelte, Angular and Solid as strong alternatives; TypeScript is assumed, and Vite is the default build tool outside Next.js. AI products moved a lot of new work here: streaming chat interfaces, generated UI, and models running in the browser.",
    "The clusters go from the platform up: how the browser works, how interfaces are built, where rendering happens, how to keep it fast and usable, and the browser APIs and security rules underneath it all."
  ],
  diagram: {
    nodes: [
      { id: "bundles", label: "Build", sub: "bundle, split, hash", col: 0, row: 0 },
      { id: "rendering-strategies", label: "Server render", sub: "SSR, SSG, or none", col: 0, row: 1 },
      { id: "rendering-pipeline", label: "Browser renders", sub: "DOM, CSSOM, layout", col: 1, row: 0 },
      { id: "hydration", label: "Hydration", sub: "JS attaches handlers", col: 1, row: 1 },
      { id: "event-loop", label: "Event loop", sub: "one main thread", col: 1, row: 2 },
      { id: "web-vitals", label: "Pixels on screen", sub: "LCP, INP, CLS", col: 2, row: 0 },
      { id: "components", label: "Components, state", sub: "re-render on change", col: 2, row: 1 },
      { id: "routing-data-fetching", label: "Data fetching", sub: "loaders, cache", col: 2, row: 2 },
      { id: "backend", label: "Backend API", sub: "JSON, streams", col: 2, row: 3 }
    ],
    edges: [
      ["bundles", "rendering-strategies", "JS, CSS"], ["rendering-strategies", "rendering-pipeline", "HTML"],
      ["rendering-pipeline", "web-vitals", "paint"], ["rendering-pipeline", "hydration", "then JS"],
      ["hydration", "components", "live"], ["hydration", "event-loop", "runs on"],
      ["components", "routing-data-fetching", "needs data"], ["routing-data-fetching", "backend", "fetch"]
    ],
    cap: "**From build to pixels: code is bundled, maybe rendered on a server, painted by the browser, then made interactive.** Everything after the first paint runs on one main thread, which is why long JavaScript tasks make a page feel stuck. Click a box to open its topic; Backend API opens the backend field."
  },
  start: [
    { label: "Tali Garsiel and Paul Irish: how browsers work", url: "https://web.dev/articles/howbrowserswork", m: 60, why: "The pipeline from bytes to pixels, which nearly every layout and performance question comes back to." },
    { label: "React docs: Learn React, from Quick Start through Managing State", url: "https://react.dev/learn", m: 120, why: "The official course for the framework most teams use; Thinking in React is the core idea." },
    { label: "web.dev: rendering on the web", url: "https://web.dev/articles/rendering-on-the-web", m: 25, why: "Client, server and static rendering and hydration on one page, with the trade-offs named." },
    { label: "MDN: Learn web development, the HTML, CSS and JavaScript core modules", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", m: 300, why: "Fill gaps in the fundamentals one module at a time; skip what you already know." }
  ],
  clusters: [
    { name: "How the browser works", line: "The machine every frontend runs on: rendering, the event loop, and layout.", topics: [
      { id: "rendering-pipeline", name: "How a browser renders",
        line: "Bytes to pixels: parse HTML and CSS, compute styles, lay out, paint, composite.",
        body: [
          "The browser parses HTML into the **DOM** and CSS into the **CSSOM**, then combines them into a tree of visible elements with their computed styles. **Layout** works out each box's size and position; **paint** records the drawing commands; **compositing** splits the page into layers and has the GPU assemble them, which is why `transform` and `opacity` animate smoothly while changing `width` does not.",
          "Scripts interrupt this. A plain `<script>` blocks parsing until it downloads and runs, so scripts are marked `defer` or `async`. Reading a layout value such as `offsetHeight` straight after changing styles forces the browser to lay out synchronously; doing that in a loop is called layout thrashing."
        ],
        where: "Chromium's Blink (Chrome, Edge and most other browsers), Apple's WebKit (Safari, and every iOS browser outside the EU, where other engines were allowed from 2024), and Mozilla's Gecko (Firefox).",
        nuance: "Most jank is the main thread busy with JavaScript, not slow painting. Changes that touch only compositing skip layout and paint; changes to geometry redo layout for everything they affect.",
        read: [{ label: "Chrome for Developers: inside look at modern web browser, part 3, the renderer", url: "https://developer.chrome.com/blog/inside-browser-part3", m: 15 }],
        tags: ["dom", "cssom", "layout", "paint", "compositing", "reflow"] },
      { id: "event-loop", name: "JavaScript and the event loop",
        line: "One thread runs your code, rendering and input in turns; block it and everything freezes.",
        body: [
          "JavaScript in a page runs on the **main thread**, which also handles input and rendering. The event loop takes one **task** at a time (a click handler, a timer, a network callback), runs it to completion, then runs every queued **microtask** (promise callbacks, `await` continuations), then gives the browser a chance to render. Async code does not run in parallel; it waits without blocking.",
          "Any task over 50 ms counts as a long task: input waits behind it and the page feels stuck. The cures are to do less, to split work and yield back to the loop (`scheduler.yield()`, or `setTimeout` as a fallback), or to move it off the main thread into a Web Worker."
        ],
        where: "Node.js and Deno run the same model on the server, which is why one slow synchronous function in an Express handler stalls every request; the Performance panel in Chrome DevTools marks long tasks directly.",
        nuance: "Microtasks run before rendering, so a promise chain that keeps queueing more microtasks can freeze a page as surely as a busy loop.",
        read: [
          { label: "Jake Archibald: tasks, microtasks, queues and schedules", url: "https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/", m: 20 },
          { label: "web.dev: optimize long tasks", url: "https://web.dev/articles/optimize-long-tasks", m: 15 }
        ],
        tags: ["main thread", "microtasks", "promises", "async", "long tasks"] },
      { id: "css-layout", name: "CSS layout",
        line: "Flexbox for one direction, Grid for two, and the box model under both.",
        body: [
          "Every element is a box: content, padding, border and margin, sized by `box-sizing` and placed according to its `display` type. **Flexbox** lays items out along one axis and shares out the spare space, which suits toolbars, rows of cards and centring. **Grid** defines rows and columns together, so items align in two dimensions, which suits page layouts and galleries.",
          "Responsive design now leans on intrinsic sizing (`minmax()`, `clamp()`, `auto-fit`) and **container queries**, which let a component adapt to the space it is given rather than to the viewport. The cascade decides which rule wins by origin, specificity and order; cascade layers (`@layer`) let a team order whole stylesheets."
        ],
        where: "Tailwind CSS, with utility classes in the markup, is the common choice in new React projects; CSS Modules and plain CSS with custom properties are the alternatives; Bootstrap still styles a large share of older sites.",
        nuance: "Most layout bugs are sizing bugs: a flex item that will not shrink because its `min-width` defaults to `auto`, or a percentage height with no sized parent. Learn the sizing rules before adding more properties.",
        read: [
          { label: "Josh W. Comeau: an interactive guide to Flexbox", url: "https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/", m: 25 },
          { label: "Josh W. Comeau: an interactive guide to CSS Grid", url: "https://www.joshwcomeau.com/css/interactive-guide-to-grid/", m: 25 }
        ],
        tags: ["flexbox", "grid", "box model", "container queries", "tailwind", "cascade"] }
    ] },
    { name: "Building interfaces", line: "Components, the state they read, the routes they live on, and the system that keeps them alike.", topics: [
      { id: "components", name: "Components and frameworks",
        line: "UI as a function of state: small reusable pieces the framework re-renders when data changes.",
        body: [
          "Modern frameworks are declarative: you describe what the UI should look like for the current state, and the framework updates the DOM to match. A **component** is a function that takes props and returns markup, composed into a tree. React re-runs a component when its state or props change and reconciles the result against the previous output; hooks (`useState`, `useEffect`) attach state and side effects to function components.",
          "The peers differ mainly in how they find what changed. Solid's signals and Vue's refs are reactive values that update exactly the DOM that reads them; Svelte compiles components into direct DOM updates; Angular has adopted signals too. React's compiler, stable since 2025, inserts memoisation automatically instead."
        ],
        where: "React (with Next.js or React Router) at Meta, Airbnb and most startups; Angular in large enterprises and across Google; Vue at GitLab and widely in China; Svelte and Solid in smaller teams that care about bundle size.",
        nuance: "Effects are the most misused part of React: deriving data or handling clicks in `useEffect` causes extra renders and bugs. Compute during render, handle events in handlers, and keep effects for syncing with systems outside React.",
        read: [
          { label: "React docs: Thinking in React", url: "https://react.dev/learn/thinking-in-react", m: 20 },
          { label: "React docs: you might not need an effect", url: "https://react.dev/learn/you-might-not-need-an-effect", m: 25 }
        ],
        tags: ["react", "vue", "svelte", "angular", "solid", "signals", "hooks", "jsx"] },
      { id: "state-management", name: "State management",
        line: "Where state lives: in a component, shared, in the URL, or on the server.",
        body: [
          "Most state belongs in the component that uses it. When siblings need it, lift it to their common parent; when distant parts of the tree need it, use context or a small store. The bigger split is between **client state** (a modal is open, a form draft) and **server state** (a copy of data that lives in a database and can go stale).",
          "Server state wants a cache, not a store: TanStack Query, SWR or the framework's loaders handle fetching, deduplication, refetching when the window regains focus, and invalidation after a change. State that should survive a reload or be shareable, such as filters and the open tab, belongs in the URL. What is left for a global store (Zustand, Redux Toolkit, Jotai) is often small."
        ],
        where: "Redux, once the default, now mostly in older large apps; Zustand and Jotai in new React apps; TanStack Query and SWR for server data; Pinia in Vue; NgRx and signals in Angular.",
        nuance: "Duplicated state drifts: keeping both a list and a filtered copy of it gives two sources of truth. Store the minimum and derive the rest during render.",
        read: [{ label: "TanStack Query docs: overview, server state against client state", url: "https://tanstack.com/query/latest/docs/framework/react/overview", m: 10 }],
        tags: ["redux", "zustand", "tanstack query", "swr", "context", "server state"] },
      { id: "routing-data-fetching", name: "Routing and data fetching",
        line: "Mapping URLs to screens, and loading their data without waterfalls.",
        body: [
          "A client-side router changes the URL with the History API and swaps components without a full page load. File-based routers (Next.js, React Router, which absorbed Remix, SvelteKit and Nuxt) derive routes from the folder structure and nest layouts so a shared shell stays mounted while the inner page changes. Each route declares the data it needs.",
          "The common mistake is a **waterfall**: a component renders, then fetches; its child renders, then fetches; three round trips happen in series. Route loaders, server components and prefetching on hover start requests in parallel and before the code needs them. Changes go through forms or server actions and then invalidate the cached data they touched."
        ],
        where: "The Next.js App Router with server components and server actions; React Router 7 loaders and actions; TanStack Router with typed routes; SvelteKit and Nuxt load functions.",
        nuance: "A fast API behind a waterfall still gives a slow page. Look in the network panel for requests that start only after another has finished.",
        tags: ["next.js", "react router", "remix", "loaders", "waterfall", "prefetch"] },
      { id: "design-systems", name: "Design systems",
        line: "Shared tokens, components and rules so every screen looks and behaves alike.",
        body: [
          "A design system is the shared source for a product's interface: **design tokens** (named values for colour, spacing, type and radius), a library of accessible components built on them, and guidance on which to use when. Tokens let a theme or dark mode change in one place; the components do the hard work of focus handling, keyboard support and states once, so every team does not redo it.",
          "Brad Frost's atomic design gives a vocabulary for the layers: atoms (a button), molecules (a search field), organisms (a header), then templates and pages. Current practice separates behaviour from looks: headless libraries supply accessible logic with no styles, and each team styles them with its own tokens."
        ],
        where: "Google's Material Design, Apple's Human Interface Guidelines, Shopify Polaris, GitHub Primer and IBM Carbon; Radix, React Aria and shadcn/ui as the headless or copy-in component layer; Storybook to build and review components in isolation.",
        nuance: "A design system is a product with users, not a one-off project. Without owners, versioning and adoption work it forks into five slightly different buttons.",
        read: [{ label: "Brad Frost: Atomic Design, chapter 2", url: "https://atomicdesign.bradfrost.com/chapter-2/", m: 20 }],
        tags: ["design tokens", "storybook", "shadcn", "radix", "material", "component library"] }
    ] },
    { name: "Where rendering happens", line: "In the browser, on a server per request, or at build time, and how the page comes alive.", topics: [
      { id: "rendering-strategies", name: "CSR, SSR and static rendering",
        line: "Where HTML is made: in the browser, on a server per request, or at build time.",
        body: [
          "**Client-side rendering** (CSR) sends an almost empty HTML page and a JavaScript bundle that builds the UI in the browser; later navigation is fast, but the first view waits for the script. **Server-side rendering** (SSR) builds HTML per request on a server, so content shows sooner and crawlers see it. **Static site generation** (SSG) builds HTML once at deploy time and serves it from a CDN, the fastest and cheapest option for content that rarely changes.",
          "Hybrids fill the gaps: incremental static regeneration rebuilds a static page in the background after a set time, and most frameworks let each route choose. The deciding questions are how personal the page is, how fresh it must be, and whether search engines need to read it."
        ],
        where: "Next.js, Nuxt, SvelteKit and Astro choose per route; Vite with React gives a plain CSR app, common for dashboards behind a login; documentation and marketing sites are mostly static.",
        nuance: "SSR speeds up first paint, not interactivity: the page can be visible and still ignore clicks until its JavaScript loads and hydrates. Measure both.",
        read: [{ label: "web.dev: rendering on the web", url: "https://web.dev/articles/rendering-on-the-web", m: 25 }],
        tags: ["csr", "ssr", "ssg", "isr", "spa", "seo"] },
      { id: "hydration", name: "Hydration and streaming",
        line: "Making server-rendered HTML interactive, and sending it in pieces as it is ready.",
        body: [
          "After SSR the browser has HTML but no event handlers. **Hydration** runs the same components again in the browser, matches their output to the existing DOM and attaches handlers. Until it finishes, the page looks ready but does not respond, and the page carries its content twice: once as HTML and once in the JavaScript that rebuilds it.",
          "Two ideas cut the cost. **Streaming SSR** sends the page shell at once and streams slower parts as their data arrives (React's `Suspense` boundaries mark the pieces), so the first byte does not wait on the slowest query. **Islands** hydrate only the interactive parts of an otherwise static page, and resumability, in Qwik, avoids replaying components in the browser at all."
        ],
        where: "Next.js and React Router stream with Suspense; Astro made islands popular for content sites; Qwik is the main resumable framework.",
        nuance: "A hydration mismatch, when server and client render different output (a date, a random id, a check of `window`), makes React throw away and re-render that part, a common source of flicker and odd bugs.",
        tags: ["hydration", "streaming", "suspense", "islands", "astro", "qwik"] },
      { id: "server-components", name: "React Server Components",
        line: "Components that run only on the server and send their output, not their code.",
        body: [
          "React Server Components (RSC) split a React tree in two. **Server components** run on the server, at build time or per request, can read a database or files directly, and send their rendered result to the browser in a serialised form; their code and dependencies never ship to the client. **Client components**, marked with `'use client'`, are the interactive parts and hydrate as before.",
          "The gain is less JavaScript and fewer fetch waterfalls in the browser: a markdown renderer used only on the server costs the client nothing. **Server actions** (`'use server'`) let a client call a server function from a form or event handler without writing an API route by hand."
        ],
        where: "The Next.js App Router is where most teams meet RSC in production; other frameworks support them at earlier stages.",
        nuance: "The server and client boundary is a network boundary: props passed to client components must be serialisable, and every server action is a public endpoint that needs its own authorisation check.",
        read: [{ label: "React docs: Server Components reference", url: "https://react.dev/reference/rsc/server-components", m: 20 }],
        tags: ["rsc", "use client", "use server", "server actions", "app router"] }
    ] },
    { name: "Fast and usable", line: "Measuring speed, shipping less code, and making sure everyone can use the result.", topics: [
      { id: "web-vitals", name: "Core Web Vitals",
        line: "Google's three field metrics for loading, responsiveness and visual stability.",
        body: [
          "**Largest Contentful Paint** (LCP) is when the largest image or text block appears; good is 2.5 s or less. **Interaction to Next Paint** (INP) is the delay from a click, tap or key press to the next frame, across the whole visit; good is 200 ms or less, and it replaced First Input Delay in March 2024. **Cumulative Layout Shift** (CLS) adds up unexpected movement of content; good is 0.1 or less.",
          "Each is judged at the 75th percentile of real visits, collected from Chrome users in the CrUX dataset, which also feeds search ranking. Lab tools such as Lighthouse catch regressions before release; field data from real users is what counts."
        ],
        where: "PageSpeed Insights and Search Console report them per page; Vercel, Cloudflare and Sentry collect them from real users; the `web-vitals` library measures them in your own analytics.",
        nuance: "LCP is often an image the browser found late (lazy-loaded, or set in CSS); INP is nearly always long JavaScript tasks; CLS is images and ads without reserved space. Fix the cause each metric points at.",
        read: [
          { label: "web.dev: Web Vitals", url: "https://web.dev/articles/vitals", m: 10 },
          { label: "web.dev: Interaction to Next Paint", url: "https://web.dev/articles/inp", m: 15 }
        ],
        tags: ["lcp", "inp", "cls", "lighthouse", "crux", "performance"] },
      { id: "bundles", name: "Bundles, splitting and build tools",
        line: "Turning source files into small, cacheable files the browser can load fast.",
        body: [
          "A bundler follows imports from an entry file, transforms TypeScript and JSX, drops unused exports (tree shaking), and writes a few files with content hashes in their names, so they can be cached for a year and replaced by changing the name. **Code splitting** breaks the output at dynamic `import()` points, so each route or heavy widget loads only when it is needed.",
          "Vite serves source files as native ES modules during development, so the dev server starts at once whatever the app's size, and bundles for production; it now uses Rolldown, a Rust bundler, in place of esbuild and Rollup. Webpack still builds many older apps; Turbopack is the Rust successor built for Next.js; SWC and esbuild do fast transforms inside many tools."
        ],
        where: "Vite under Vue, SvelteKit, Astro and React Router apps; Turbopack in Next.js; bundle analysers and size budgets in CI at companies that watch performance.",
        nuance: "JavaScript costs more than its download: it must be parsed and run on the main thread, and a mid-range phone does that several times slower than a laptop. A bundle that feels fine on a MacBook hurts INP on an average Android phone.",
        read: [
          { label: "Vite docs: why Vite", url: "https://vite.dev/guide/why", m: 10 },
          { label: "web.dev: reduce JavaScript payloads with code splitting", url: "https://web.dev/articles/reduce-javascript-payloads-with-code-splitting", m: 10 }
        ],
        tags: ["vite", "webpack", "rolldown", "turbopack", "tree shaking", "code splitting"] },
      { id: "accessibility", name: "Accessibility",
        line: "Making the interface work for keyboard, screen reader and low-vision users.",
        body: [
          "Browsers build an **accessibility tree** from the DOM: each element's role, name and state, which screen readers (VoiceOver, NVDA, JAWS) read aloud. Native HTML gets most of it right: a `<button>` is focusable, activates with Enter and Space and announces itself as a button; a clickable `<div>` does none of that. ARIA attributes patch the tree when no native element fits, as in tabs, comboboxes and dialogs.",
          "The core checks are keyboard access with a visible focus, a label on every input, text contrast of at least 4.5:1, headings in order, and focus that moves sensibly when dialogs open and close. WCAG 2.2 at level AA is the usual legal and contractual target."
        ],
        where: "The European Accessibility Act began applying to many products and services in June 2025; in the US, lawsuits over inaccessible websites run to thousands a year; axe and Lighthouse automate part of the checks.",
        nuance: "Automated tools catch only part of the problems. The rest needs a keyboard and a screen reader, and wrong ARIA makes a page worse than no ARIA.",
        read: [
          { label: "web.dev: Learn Accessibility, the ARIA, focus and testing modules", url: "https://web.dev/learn/accessibility", m: 60 },
          { label: "W3C: ARIA Authoring Practices Guide, patterns for common widgets", url: "https://www.w3.org/WAI/ARIA/apg/", m: 20 }
        ],
        tags: ["a11y", "wcag", "aria", "screen reader", "keyboard", "contrast"] },
      { id: "testing-frontend", name: "Testing the frontend",
        line: "Component tests that act like a user, and a few browser tests end to end.",
        body: [
          "Frontend tests pay off when they exercise behaviour, not implementation. Testing Library renders a component and finds elements the way a person would, by role, label or text, then clicks and types; a refactor that keeps behaviour keeps the tests green. Vitest or Jest run these in a simulated DOM in milliseconds.",
          "**End-to-end tests** drive a real browser through whole flows such as sign-up and checkout; Playwright runs them across Chromium, WebKit and Firefox and waits for elements automatically. Visual regression tests compare screenshots, and axe accessibility checks can run inside both."
        ],
        where: "Playwright has largely replaced Selenium and overtaken Cypress in new projects; Storybook with Chromatic for component and visual tests; Vitest with Testing Library as the common unit layer.",
        nuance: "Snapshot tests of markup break on every harmless change and get updated without being read. Test what the user sees and does, and keep end-to-end tests for the flows that matter most.",
        read: [
          { label: "Testing Library: guiding principles", url: "https://testing-library.com/docs/guiding-principles", m: 5 },
          { label: "Playwright docs: getting started", url: "https://playwright.dev/docs/intro", m: 10 }
        ],
        tags: ["playwright", "vitest", "jest", "testing library", "cypress", "e2e"] }
    ] },
    { name: "Platform and security", line: "What the browser gives you beyond the DOM, and the rules that keep pages from attacking each other.", topics: [
      { id: "web-apis", name: "Web APIs: fetch, storage, workers",
        line: "What the browser offers beyond the DOM: network, storage, threads and offline.",
        body: [
          "`fetch` makes HTTP requests and returns a promise; a streaming response can be read chunk by chunk, which is how chat interfaces show tokens as they arrive. Storage comes in layers: cookies (small, sent with every request), `localStorage` (synchronous, a few MB, strings only), and **IndexedDB** (asynchronous, structured, large).",
          "**Web Workers** run scripts on another thread and talk to the page through `postMessage`; they cannot touch the DOM, which suits parsing, search indexes and in-browser models. **Service workers** sit between the page and the network, so they can cache responses for offline use and receive push messages; they are the basis of installable progressive web apps."
        ],
        where: "Gmail and Google Docs keep offline copies in IndexedDB; transformers.js and WebLLM run models in the browser on WebGPU; service workers power offline progressive web apps such as Starbucks' ordering site.",
        nuance: "`localStorage` is synchronous and readable by any script on the page, so it is a poor place for tokens and a slow place for large data. Browsers may also evict stored data under pressure unless the site asks for persistence.",
        read: [{ label: "MDN: using Web Workers", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers", m: 15 }],
        tags: ["fetch", "indexeddb", "localstorage", "web workers", "service workers", "pwa", "webgpu"] },
      { id: "browser-security", name: "XSS and Content Security Policy",
        line: "Keeping attacker-controlled text from running as code in your page.",
        body: [
          "**Cross-site scripting** (XSS) happens when input from a user ends up in the page as markup or script: a comment containing a `<script>` that runs in every reader's browser, with their session. Frameworks escape text by default, so the risk gathers at the escape hatches: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`, links whose URL starts with `javascript:`, and model output rendered as HTML.",
          "The defences are layered: encode output for its context, sanitise any HTML you must render (DOMPurify), keep session cookies `HttpOnly`, and send a **Content Security Policy**. A strict CSP allows only scripts that carry a per-response nonce, so an injected script does not run even if it reaches the page."
        ],
        where: "Google and GitHub ship strict CSPs; DOMPurify sanitises user and model-generated HTML in chat interfaces; browsers report CSP violations to an endpoint, so teams see attempted attacks.",
        nuance: "Markdown from an LLM is user input. Rendering it as raw HTML is an XSS bug, and a prompt injection can produce one on purpose.",
        read: [
          { label: "OWASP: cross-site scripting prevention cheat sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", m: 20 },
          { label: "MDN: Content Security Policy guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP", m: 15 }
        ],
        tags: ["xss", "csp", "nonce", "dompurify", "sanitise", "injection"] },
      { id: "cors-csrf", name: "CORS and CSRF",
        line: "Two rules about cross-origin requests: who may read responses, and who may send them.",
        body: [
          "The **same-origin policy** stops a script on one origin (scheme, host and port) from reading responses from another. **CORS** is how a server relaxes that: it answers with `Access-Control-Allow-Origin` naming who may read. Requests outside a narrow 'simple' set (methods such as `PUT` or `DELETE`, custom headers, a JSON content type) first send a **preflight** `OPTIONS` request to ask permission.",
          "CORS does not stop a request being sent; it stops the response being read. **CSRF** exploits that gap: a malicious site submits a form to your API and the browser attaches the user's cookies. The defences are `SameSite` cookies (Chrome treats cookies as `Lax` by default), anti-CSRF tokens, and checking the `Origin` or `Sec-Fetch-Site` header on requests that change state."
        ],
        where: "Every single-page app that calls an API on another subdomain configures CORS; Rails and Django ship CSRF tokens by default; APIs authenticated by a bearer header rather than a cookie are not exposed to CSRF.",
        nuance: "`Access-Control-Allow-Origin: *` cannot be combined with credentials, and echoing back any request's origin to get around that opens your API to every site. CORS errors are fixed on the server, never in the browser.",
        read: [
          { label: "MDN: cross-origin resource sharing (CORS) guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS", m: 20 },
          { label: "OWASP: cross-site request forgery prevention cheat sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html", m: 20 }
        ],
        tags: ["cors", "csrf", "same-origin", "preflight", "samesite", "cookies"] }
    ] }
  ]
});

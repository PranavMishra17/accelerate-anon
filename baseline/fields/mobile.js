BASELINE.field({
  id: "mobile", name: "Mobile engineering", short: "Mobile", layer: "Building",
  ink: "#6A4E8C", inkDark: "#B9A1DE",
  lede: "Mobile engineering builds apps for phones and tablets: native or cross-platform code that runs under an operating system which controls its lifecycle, its background time and how it reaches users.",
  overview: [
    "Mobile engineers build and ship iOS and Android apps: screens and navigation, local storage and sync with a backend, push notifications, payments, camera and sensors, and the release process through two app stores. Titles are iOS engineer, Android engineer, mobile engineer (often cross-platform) and mobile platform engineer, who owns builds, CI, release tooling and app size. A typical day is a new screen, a crash that appears only on one maker's Android phones, a review rejection to answer, or a release held at 10% while a metric settles.",
    "It is the **frontend** discipline under harder rules. The OS can suspend or kill the app at any time, the network comes and goes, battery and memory are budgets, and every release passes store review and then lives on devices for months, because users update when they choose. Data comes from the **backend**, and offline-first apps borrow ideas from **distributed systems**. In 2026 native means Swift with SwiftUI and Kotlin with Jetpack Compose; React Native and Flutter lead cross-platform, and Kotlin Multiplatform shares logic, and now UI, from the Android side. iOS holds over half of US smartphones; Android holds about 70% worldwide.",
    "Read the tab as one app's life: the platform and framework it is written in, how the OS treats it, the data, network and hardware it lives with, then how it ships and how you learn that it broke."
  ],
  diagram: {
    nodes: [
      { id: "ios-native", label: "iOS app", sub: "Swift, SwiftUI", col: 0, row: 0 },
      { id: "react-native", label: "Cross-platform", sub: "RN, Flutter, KMP", col: 0, row: 1 },
      { id: "android-native", label: "Android app", sub: "Kotlin, Compose", col: 0, row: 2 },
      { id: "app-store", label: "App stores", sub: "review, phased release", col: 0, row: 3 },
      { id: "app-lifecycle", label: "Lifecycle", sub: "active to killed", col: 1, row: 0 },
      { id: "offline-sync", label: "Local database", sub: "the app's truth", col: 1, row: 1 },
      { id: "background-work", label: "Background work", sub: "when the OS allows", col: 1, row: 2 },
      { id: "crash-analytics", label: "Crash reports", sub: "Crashlytics, Sentry", col: 2, row: 0 },
      { id: "backend", label: "Backend", sub: "APIs, sync", col: 2, row: 1 },
      { id: "push-notifications", label: "Push", sub: "APNs, FCM", col: 2, row: 2 }
    ],
    edges: [
      ["ios-native", "app-lifecycle", "runs"], ["react-native", "offline-sync", "reads"],
      ["android-native", "background-work", "jobs"], ["android-native", "app-store", "ships"],
      ["app-lifecycle", "offline-sync", "saves state"], ["app-lifecycle", "crash-analytics", "crashes"],
      ["offline-sync", "backend", "sync"], ["push-notifications", "background-work", "wakes"]
    ],
    cap: "**One app's life: written in a platform's language, run under the OS's rules, synced with a backend, shipped through a store.** The middle column is what the OS controls: when the app runs, what survives when it is killed, and when background work may happen. Click a box to open its topic; Backend opens the backend field."
  },
  start: [
    { label: "Android Developers: Android Basics with Compose, units 1 to 3", url: "https://developer.android.com/courses/android-basics-compose/course", m: 480, why: "Google's free course: Kotlin, Compose layouts and state, in small projects you build yourself." },
    { label: "Hacking with Swift: 100 Days of SwiftUI, days 1 to 15 on Swift itself", url: "https://www.hackingwithswift.com/100/swiftui", m: 300, why: "The most used free path into Swift and SwiftUI, one short lesson a day." },
    { label: "Android Developers: guide to app architecture", url: "https://developer.android.com/topic/architecture", m: 30, why: "Layers, a single source of truth and one-way data flow; the ideas apply on iOS and cross-platform too." },
    { label: "Ink & Switch: local-first software", url: "https://www.inkandswitch.com/essay/local-first/", m: 45, why: "Why an app should work from its own data first, and what sync and CRDTs make possible." }
  ],
  clusters: [
    { name: "Platforms and frameworks", line: "Native code for each platform, or one codebase for both, and what each choice costs.", topics: [
      { id: "ios-native", name: "iOS: Swift and SwiftUI",
        line: "Apple's language and declarative UI framework, with UIKit still underneath many apps.",
        body: [
          "**Swift** is Apple's compiled, memory-safe language: value types (`struct`), optionals instead of null, protocols, and since Swift 6 compile-time checks for data races built on `async`/`await` and actors. **SwiftUI**, from 2019, describes views as functions of state: change an `@State` value or an `@Observable` model and the affected views redraw. **UIKit**, the older imperative framework, still powers many large apps and fills gaps SwiftUI leaves.",
          "Apps are built in Xcode, signed with certificates tied to an Apple Developer account ($99 a year), and reach testers through TestFlight and users through the App Store."
        ],
        uses: [
          "**Widgets and Live Activities**: home screen widgets, lock screen Live Activities and watchOS apps are built with SwiftUI.",
          "**Banking and health apps**: written natively to use platform features such as Face ID, HealthKit and Apple Pay as soon as they ship."
        ],
        example: "A counter in SwiftUI: `struct Counter: View { @State var n = 0; var body: some View { Button(\"Taps: \\(n)\") { n += 1 } } }`. A tap changes `n`; SwiftUI sees the state change, calls `body` again and updates the label. In UIKit you would hold a reference to the button and call `setTitle` yourself after every tap.",
        nuance: "SwiftUI's newest features need the newest iOS, and most apps support the last two or three versions, so teams often wait a year or write a screen twice. Knowing UIKit is still worth it.",
        read: [{ label: "Hacking with Swift: 100 Days of SwiftUI, the first SwiftUI projects", url: "https://www.hackingwithswift.com/100/swiftui", m: 60 }],
        tags: ["swift", "swiftui", "uikit", "xcode", "testflight", "concurrency"] },
      { id: "android-native", name: "Android: Kotlin and Jetpack Compose",
        line: "Google's preferred language and declarative UI toolkit, on a vast range of devices.",
        body: [
          "**Kotlin** has been Google's preferred Android language since 2019: null safety in the type system, data classes, and coroutines with `Flow` for asynchronous work. **Jetpack Compose** builds UI from composable functions; when state they read changes, Compose re-runs (recomposes) only the functions affected, so composables must be fast and free of side effects. The older XML view system remains in many codebases.",
          "Google's recommended architecture separates a UI layer (composables, and a `ViewModel` holding screen state) from a data layer (repositories over Room, DataStore and the network), with state flowing down and events flowing up."
        ],
        uses: [
          "**Play Store apps**: run across thousands of device models from Samsung, Xiaomi, Google and others, at every screen size and Android version.",
          "**Wear OS and Android TV**: Compose for Wear OS and Compose for TV carry the same Kotlin skills to watches and televisions."
        ],
        example: "A list with a search box. The `ViewModel` exposes `val state: StateFlow<UiState>`; the composable collects it and draws. Typing calls `viewModel.onQuery(\"lamp\")`, an event going up. The ViewModel filters, emits a new `UiState`, and state comes down. When the phone rotates, the activity is recreated but the ViewModel survives, so the query and results stay put.",
        nuance: "Fragmentation is the real job: many Android versions and screen sizes, vendor battery savers that kill background work, and low-end phones with little memory. Test on a cheap phone, not only a Pixel.",
        read: [{ label: "Android Developers: thinking in Compose", url: "https://developer.android.com/develop/ui/compose/mental-model", m: 15 }],
        tags: ["kotlin", "jetpack compose", "coroutines", "viewmodel", "room", "gradle"] },
      { id: "react-native", name: "React Native",
        line: "React components rendered as real native views, with JavaScript driving them.",
        body: [
          "React Native lets a team write React and TypeScript and get native iOS and Android UI: a `<View>` becomes a `UIView` or an Android `View`, not a web page. Since version 0.76 the **New Architecture** is the default: JavaScript calls native code directly through JSI instead of an asynchronous message bridge, and the Fabric renderer supports React's concurrent features.",
          "Most new projects start with **Expo**, which supplies a build service, native modules for common needs (camera, notifications, files) and over-the-air updates of the JavaScript bundle. Swift or Kotlin is still written when no module covers a platform API."
        ],
        uses: [
          "**Meta**: parts of the Facebook, Instagram and Messenger apps are React Native screens inside the native apps.",
          "**Shopify**: moved its mobile apps to React Native, sharing code and engineers across iOS and Android.",
          "**Microsoft Office**: uses React Native for parts of its interface, including on Windows and macOS.",
          "**Discord and Coinbase**: ship their main mobile apps on React Native."
        ],
        example: "A chat screen shows 5,000 messages. Rendering them all with `.map()` inside a `ScrollView` creates 5,000 native views and the app stutters. `FlatList` renders only the rows on screen plus a small window, unmounting rows as you scroll past them, so memory stays flat. With Expo, a fix like that ships as an over-the-air update without a store review.",
        nuance: "It shares a web React team's skills, not their screens: mobile layouts, navigation and gestures still differ. Performance problems usually come from heavy work on the JavaScript thread and lists that render too much.",
        read: [{ label: "React Native docs: about the New Architecture", url: "https://reactnative.dev/architecture/landing-page", m: 15 }],
        tags: ["react native", "expo", "jsi", "fabric", "turbomodules", "cross-platform"] },
      { id: "flutter", name: "Flutter",
        line: "Dart code that draws every pixel itself, so the UI looks the same everywhere.",
        body: [
          "Flutter, from Google, takes a different route from React Native: instead of mapping to native views, it renders its own widgets with its own engine (Impeller, which replaced Skia as the default renderer), and Dart compiles ahead of time to native ARM code. The same widget tree runs on iOS, Android, web and desktop with identical pixels.",
          "Everything is a widget, composed in a tree and rebuilt when state changes; hot reload applies code changes in about a second while keeping the app's state. State management is a choice among libraries such as Provider, Riverpod and Bloc."
        ],
        uses: [
          "**Google Pay**: rebuilt in Flutter so one codebase serves the Android and iOS apps.",
          "**Nubank**: one of the largest digital banks, builds its mobile app in Flutter.",
          "**My BMW**: BMW's app for car owners, written once in Flutter for both platforms.",
          "**Alibaba's Xianyu**: a second-hand marketplace and one of the earliest large Flutter apps."
        ],
        example: "A Flutter button looks the same on an iPhone and a Pixel, because Flutter draws it pixel by pixel. That is the strength and the cost. When iOS 26 brought its new Liquid Glass look, native apps picked up the new controls when rebuilt with the new SDK, while a Flutter app kept its own drawing until the framework or the team redrew it.",
        nuance: "Drawing its own widgets means a Flutter app does not get platform look and behaviour for free: new iOS controls, text selection and accessibility semantics must be matched by the framework, and Dart is a language few hires already know.",
        read: [{ label: "Flutter docs: architectural overview", url: "https://docs.flutter.dev/resources/architectural-overview", m: 30 }],
        tags: ["flutter", "dart", "impeller", "skia", "widgets", "hot reload"] },
      { id: "kmp", name: "Kotlin Multiplatform",
        line: "Share Kotlin logic across iOS and Android, and optionally the UI too.",
        body: [
          "Kotlin Multiplatform (KMP) compiles shared Kotlin code to JVM bytecode for Android and to native binaries for iOS, which Swift calls like any framework. Teams usually start by sharing the layers below the UI (networking, models, validation, persistence with SQLDelight or Room, business rules) while each platform keeps its native screens.",
          "**Compose Multiplatform** extends Jetpack Compose to iOS, desktop and web; its iOS support became stable in May 2025, so screens can be shared as well. Code that must differ per platform uses `expect` and `actual` declarations."
        ],
        uses: [
          "**Google Docs on iOS**: shares business logic with the Android app through KMP.",
          "**Cash App**: shares logic written in Kotlin between its iOS and Android apps.",
          "**Netflix studio apps**: the apps used on film and TV productions share logic across platforms with KMP.",
          "**McDonald's**: its global mobile app shares code between iOS and Android through KMP."
        ],
        example: "Common code declares `expect fun platformName(): String`. The Android source set supplies `actual fun platformName() = \"Android \" + Build.VERSION.SDK_INT`; the iOS one returns `UIDevice.currentDevice.systemName()`. The login validator, API client and SQLDelight queries are written once in Kotlin, and Swift calls `LoginValidator().check(email)` as if it were a native class.",
        nuance: "It is the lowest-risk way to share code because one layer can move over at a time, but iOS developers must accept Kotlin in their build, and Swift interop for coroutines and generics still needs care.",
        read: [{ label: "Kotlin docs: Kotlin Multiplatform, get started", url: "https://kotlinlang.org/docs/multiplatform/get-started.html", m: 10 }],
        tags: ["kmp", "compose multiplatform", "kotlin", "shared code", "expect actual"] }
    ] },
    { name: "How the OS treats your app", line: "The OS owns the process, the background and the ways in.", topics: [
      { id: "app-lifecycle", name: "App lifecycle",
        line: "The OS decides when your app is running, suspended or killed, and gives little notice.",
        body: [
          "A mobile app is not a process that runs until the user quits. On iOS an app moves between active, inactive, background and suspended; once suspended it runs no code and can be terminated to free memory without warning. On Android an `Activity` passes through `onCreate`, `onStart`, `onResume`, `onPause`, `onStop` and `onDestroy`, and the whole process can be killed in the background. Rotation recreates the activity by default.",
          "Save anything the user would miss as they leave a screen and restore it on return: `rememberSaveable` and saved `ViewModel` state on Android, scene storage and state restoration on iOS."
        ],
        uses: [
          "**Android's 'Don't keep activities' option**: a developer setting that destroys each activity as soon as you leave it, reproducing lifecycle bugs on demand.",
          "**adb**: `adb shell am kill` ends a backgrounded app's process, so you can check that it reopens where it was."
        ],
        example: "A user fills half a sign-up form, switches to email to copy a code, and the phone, short on memory, kills the app. On return, Android recreates the activity on the same screen. If the fields lived in plain variables, they are empty. If they lived in `rememberSaveable` or a `SavedStateHandle`, they come back as typed.",
        nuance: "Process death is the case teams never test: the app reopens on the last screen with empty memory. State kept in a singleton survives rotation and fails exactly there.",
        read: [{ label: "Android Developers: the activity lifecycle", url: "https://developer.android.com/guide/components/activities/activity-lifecycle", m: 20 }],
        tags: ["lifecycle", "process death", "activity", "scene", "state restoration"] },
      { id: "background-work", name: "Background work and its limits",
        line: "Work the OS allows when your app is not on screen, on the OS's schedule.",
        body: [
          "Both platforms ration background time to save battery. iOS gives an app a short grace period after it leaves the screen, then runs deferred work only through `BGTaskScheduler`, when the system chooses, plus special modes for audio, navigation and calls. Android's Doze and App Standby defer work for idle apps; long tasks need a **foreground service** with a visible notification, and since Android 14 each must declare its type.",
          "For deferrable work that must eventually happen, Android's **WorkManager** persists the job, honours constraints like Wi-Fi or charging, retries with backoff and survives reboots."
        ],
        uses: [
          "**Google Photos**: backs up photos with background jobs that can wait for Wi-Fi, so a large backup does not use mobile data.",
          "**Podcast apps**: download new episodes in background tasks the OS schedules, often overnight while charging.",
          "**WhatsApp and Signal**: learn of new messages through push rather than polling, since a background poll would be stopped."
        ],
        example: "Uploading a photo on Android: `WorkManager.getInstance(ctx).enqueue(OneTimeWorkRequestBuilder<UploadWorker>().setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.UNMETERED).build()).build())`. The user closes the app while on mobile data. The job waits; when the phone joins Wi-Fi, even after a reboot, WorkManager runs it, and a failed upload is retried with backoff.",
        nuance: "There is no reliable way to run code every 15 minutes on iOS. Design for 'eventually', use push to trigger urgent work, and expect vendor battery savers on some Android phones to stop even well-behaved jobs.",
        read: [{ label: "Android Developers: persistent work with WorkManager", url: "https://developer.android.com/develop/background-work/background-tasks/persistent", m: 10 }],
        tags: ["workmanager", "bgtaskscheduler", "doze", "foreground service", "battery"] },
      { id: "push-notifications", name: "Push notifications",
        line: "A message from your server, through Apple or Google, that reaches a phone even when closed.",
        body: [
          "Apps cannot keep their own connection open in the background, so push goes through the platform: **APNs** for Apple devices and **Firebase Cloud Messaging** (FCM) for Android. The app asks the OS for a device token and sends it to your backend; to notify a user, the backend sends that token and a payload to APNs or FCM, which deliver over a connection the OS already keeps open.",
          "**Notification** messages are displayed by the OS, even when the app is not running. **Data** (silent) messages wake the app briefly to fetch or sync; they are throttled and not guaranteed."
        ],
        uses: [
          "**Uber and DoorDash**: push each trip or delivery status change, and update Live Activities on the iOS lock screen.",
          "**Banking apps**: push an alert for a card payment within seconds of the transaction.",
          "**OneSignal, Braze and Airship**: manage tokens, segments and campaigns, and send through APNs and FCM for you."
        ],
        example: "A new chat message arrives. The backend looks up the recipient's two device tokens and posts to FCM's HTTP v1 API with `{ message: { token, notification: { title: \"New message\", body: \"Lunch at 1?\" } } }`. FCM delivers over the connection Android already holds open, and the banner shows though the app is closed. The other token comes back `UNREGISTERED`, so the backend deletes it.",
        nuance: "Tokens change and go stale, so the backend must refresh and prune them. iOS and Android 13 onwards require the user's permission, so ask when the value is clear, not at first launch.",
        read: [{ label: "Firebase docs: Cloud Messaging overview", url: "https://firebase.google.com/docs/cloud-messaging", m: 10 }],
        tags: ["apns", "fcm", "device token", "silent push", "notifications"] },
      { id: "deep-links", name: "Deep links",
        line: "URLs that open a specific screen inside an app instead of a web page.",
        body: [
          "A deep link routes a URL to a screen inside the app: a product, a chat, a password reset. Custom schemes (`myapp://orders/42`) work, but any app can claim the same scheme. **Universal Links** on iOS and **Android App Links** use ordinary `https://` URLs instead, verified by a file on your domain (`apple-app-site-association`, `assetlinks.json`), so the OS opens your app directly and falls back to the website when it is not installed.",
          "Inside the app, a router parses the link, builds a navigation stack so Back leads somewhere useful, and holds the link behind sign-in when needed."
        ],
        uses: [
          "**Slack**: a magic sign-in link from email opens the app and completes the login.",
          "**Branch and AppsFlyer**: deferred deep links that carry the destination through an install from the store, a job Firebase Dynamic Links did until it shut down in August 2025.",
          "**Marketing and order emails**: links that open the matching screen in the app when it is installed and the web page when it is not."
        ],
        example: "Someone taps `https://shop.example.com/p/42` in a message. iOS has already fetched the `apple-app-site-association` file for `shop.example.com`, sees that `/p/*` belongs to the shop's app, and opens the app with that URL. The app's router builds Home, then Product 42, so Back returns to Home instead of leaving. Without the app, Safari opens the same page.",
        nuance: "Treat a deep link as untrusted input: anyone can send one, so validate its parameters and never let it trigger an action such as a payment or a settings change without confirmation.",
        read: [{ label: "Android Developers: about App Links", url: "https://developer.android.com/training/app-links", m: 10 }],
        tags: ["universal links", "app links", "url schemes", "routing", "attribution"] }
    ] },
    { name: "Data, network and the device", line: "Working without a connection, on bad connections, and within the phone's limits.", topics: [
      { id: "offline-sync", name: "Offline-first and sync",
        line: "The local database is the app's truth; the network catches up when it can.",
        body: [
          "An offline-first app reads and writes a local database (SQLite through Room, Core Data or SwiftData, or a sync engine's store) and renders from it, so the UI works on a plane and feels instant on a good network. Writes queue locally, and a sync process pushes them to the backend and pulls changes back when the connection returns.",
          "The hard part is **conflicts**: two devices edit the same record while apart. Simple apps pick last write wins by timestamp; collaborative apps track changes per field or use CRDTs, data types that merge concurrent edits without a central referee. Records created offline need ids generated on the client."
        ],
        uses: [
          "**Firestore**: caches documents on the device, serves reads offline and replays queued writes when the connection returns.",
          "**PowerSync and ElectricSQL**: sync engines that keep Postgres data in step with a local store on the device.",
          "**Realm Sync**: MongoDB's mobile sync, deprecated in 2024, a reminder to weigh a sync vendor's future before building on it."
        ],
        example: "A technician on a site with no signal closes job 812 and attaches a photo. The app writes both to SQLite, marks them pending, and shows the job closed at once. Back in coverage, sync uploads them. Meanwhile the office changed the job's address. A merge per field keeps both edits; last write wins on the whole record would have silently dropped one.",
        nuance: "Last write wins silently loses data, and device clocks are wrong more often than you expect. Decide per field what a conflict should do before writing the sync code.",
        read: [
          { label: "Android Developers: build an offline-first app", url: "https://developer.android.com/topic/architecture/data-layer/offline-first", m: 20 },
          { label: "Ink & Switch: local-first software, the sections on CRDTs", url: "https://www.inkandswitch.com/essay/local-first/", m: 25 }
        ],
        tags: ["offline", "sync", "sqlite", "crdt", "conflict resolution", "local-first"] },
      { id: "networking", name: "Networking on bad connections",
        line: "Mobile networks drop, stall and change under you; design every call for that.",
        body: [
          "A phone moves between Wi-Fi, 5G and no signal in the middle of a request, so latency of hundreds of milliseconds and failed requests are normal, not exceptional. Every call needs a timeout, retries with backoff for idempotent requests, and a UI that shows progress and lets the user try again. Large uploads should be resumable in chunks.",
          "Fewer, larger requests save battery: the radio stays in a high-power state for seconds after each transfer, so a stream of small requests keeps it awake. HTTP/3 over QUIC helps, because a connection can survive a change of network."
        ],
        uses: [
          "**OkHttp and URLSession**: the HTTP clients under most Android and iOS apps, with connection pooling, caching and timeouts.",
          "**Facebook Lite and WhatsApp**: built for slow, costly networks in emerging markets, with small payloads and heavy caching.",
          "**Network Link Conditioner**: Apple's tool that throttles a device to profiles such as 3G or a very bad network, so poor links can be tested at a desk."
        ],
        example: "A 50 MB video upload over a train's patchy signal fails at 38 MB. Sent as one request, it restarts from zero and may never finish. Split into 5 MB chunks with a resumable protocol such as tus, the client asks the server for the last committed offset, 35 MB, and sends from there: three more chunks instead of ten.",
        nuance: "Office Wi-Fi hides most of these bugs. Throttle to a slow profile and toggle airplane mode mid-request before calling a flow done.",
        read: [{ label: "Android Developers: optimize network access", url: "https://developer.android.com/develop/connectivity/network-ops/network-access-optimization", m: 10 }],
        tags: ["okhttp", "urlsession", "retries", "quic", "http/3", "radio"] },
      { id: "mobile-security", name: "Mobile security and storage",
        line: "Assume the device can be lost, rooted or inspected, and protect secrets accordingly.",
        body: [
          "Secrets and tokens go in the platform's protected store: the **Keychain** on iOS and the **Android Keystore**, both backed by secure hardware on modern phones. Plain preferences, files and SQLite databases are readable on a rooted or jailbroken device and sometimes in backups. Traffic uses TLS, and some apps pin certificates to resist interception.",
          "Anything shipped in the app binary is public: an API key in the code can be extracted in minutes, so keys that cost money belong on the backend. Attestation (App Attest on iOS, the Play Integrity API on Android) lets a server check that a request comes from a genuine install."
        ],
        uses: [
          "**Banking and payment apps**: follow OWASP's MASVS and add root detection and attestation.",
          "**Face ID and fingerprint checks**: guard Keychain and Keystore entries, so a token is released only after a biometric check.",
          "**Play Integrity API**: lets a game's or bank's server reject requests from modified apps and emulators."
        ],
        example: "An app ships an LLM provider's API key in its code to call the model directly. Someone unzips the APK, runs `strings` over it, finds the key, and runs up the bill. The fix: the app calls your backend with the user's session token; the backend, which holds the key, checks attestation and a per-user quota, then calls the model.",
        nuance: "A mobile app is a client you do not control. Every rule that matters (prices, limits, permissions) must be enforced on the server, however well the app is hardened.",
        read: [{ label: "OWASP: Mobile Application Security Verification Standard (MASVS)", url: "https://mas.owasp.org/MASVS/", m: 20 }],
        tags: ["keychain", "keystore", "masvs", "attestation", "play integrity", "certificate pinning"] },
      { id: "performance-battery", name: "Performance and battery",
        line: "Fast start, smooth frames, little memory and little battery, on mid-range phones.",
        body: [
          "Users feel three things. **Startup**: a cold start builds the process and first screen from nothing, so defer anything the first frame does not need. **Smoothness**: at 60 Hz each frame has about 16 ms, at 120 Hz about 8 ms, and main-thread work beyond that drops frames. **Responsiveness**: on Android, blocking the main thread for 5 seconds brings up an 'app not responding' (ANR) dialog.",
          "Battery drains through the radio, GPS, wake locks and background work. Google Play treats a user-perceived crash rate over 1.09% or an ANR rate over 0.47% as bad behaviour, and can lower the app's visibility in the store."
        ],
        uses: [
          "**Android vitals in the Play Console**: reports startup time, ANR and crash rates from real devices, measured against Play's thresholds.",
          "**MetricKit and Xcode Organizer**: deliver launch times, hangs and battery use collected from users' iPhones.",
          "**Baseline Profiles**: ship a list of hot code paths so Android compiles them ahead of time, making startup faster from the first launch."
        ],
        example: "A cold start takes 2.8 s on a mid-range phone. The startup trace shows an analytics SDK, a crash reporter, a feature-flag fetch and a database migration all running in `Application.onCreate`. Moving analytics and flags off the main thread, and the migration to the first visit of the screen that needs it, gets the first frame up in 1.1 s.",
        nuance: "Profile release builds on a mid-range device. Debug builds are slower, and flagship phones hide the problems most users have.",
        read: [
          { label: "Android Developers: Android vitals", url: "https://developer.android.com/topic/performance/vitals", m: 10 },
          { label: "Android Developers: app startup time", url: "https://developer.android.com/topic/performance/vitals/launch-time", m: 15 }
        ],
        tags: ["startup", "anr", "jank", "frame rate", "battery", "android vitals"] },
      { id: "on-device-ml", name: "On-device ML",
        line: "Running models on the phone's neural hardware for privacy, latency and offline use.",
        body: [
          "Phones carry neural accelerators (Apple's Neural Engine, and NPUs in Qualcomm, Google Tensor and MediaTek chips), so many models run locally: no network round trip, no server cost, and data that never leaves the device. Models are converted and usually quantised to 8 or 4 bits to fit memory and power budgets.",
          "On iOS, **Core ML** runs converted models, and the **Foundation Models** framework gives apps Apple's on-device language model through a Swift API. On Android, **LiteRT** (formerly TensorFlow Lite) runs models on CPU, GPU or NPU, and Gemini Nano is reached through ML Kit's GenAI APIs. ONNX Runtime and ExecuTorch work on both."
        ],
        uses: [
          "**Face ID and keyboard prediction**: run on the phone's neural hardware, so faces and typing never leave the device.",
          "**Live Caption on Android**: transcribes any audio playing on the phone locally, with no connection needed.",
          "**Apple Intelligence and Gemini Nano**: small on-device language models that summarise notifications and rewrite text."
        ],
        example: "A 3-billion-parameter model stored in 16-bit weights needs about 6 GB, more than an app can use on most phones. Quantised to 4 bits it needs about 1.5 GB and can decode a few dozen tokens a second on a recent phone. That is enough to summarise a notification; a long reasoning task still goes to a server.",
        nuance: "A model that runs is not a model that ships: app size, memory spikes, heat and battery all limit it, and on-device models are far smaller than server ones. Many apps run a small model locally and fall back to a server for hard cases.",
        read: [
          { label: "Google AI Edge: LiteRT overview", url: "https://developers.google.com/edge/litert", m: 10 },
          { label: "Apple Developer: machine learning, Core ML and the Foundation Models framework", url: "https://developer.apple.com/machine-learning/", m: 10 }
        ],
        tags: ["core ml", "litert", "tflite", "gemini nano", "npu", "quantisation", "foundation models"] }
    ] },
    { name: "Shipping and learning", line: "Getting a build to users safely, and finding out what happened next.", topics: [
      { id: "app-store", name: "App store distribution and review",
        line: "Every release passes Apple's or Google's review, under rules that shape the product.",
        body: [
          "Apps reach users through the App Store and Google Play, each with signing, store listings, privacy disclosures and review. Apple reviews every build against its App Review Guidelines, and most reviews finish within a day. Google Play reviews too, mostly automatically. Betas go out through TestFlight and Play testing tracks.",
          "The rules reach into design. Apple's guideline 2.5.2 forbids downloading code that changes an app's features, which bounds what over-the-air updates may do. Digital goods must use in-app purchase in most cases, though US court rulings and the EU's Digital Markets Act opened external payment links and alternative stores in some regions."
        ],
        uses: [
          "**App Store Connect and the Play Console**: where builds are uploaded, listings and privacy labels written, and review status tracked.",
          "**fastlane**: automates signing, screenshots and uploads to both stores from CI.",
          "**Fortnite**: removed from the App Store in 2020 in a dispute over payments, it came back to iPhones in the EU through an alternative store and in the US in 2025."
        ],
        example: "A payment bug ships on Monday. On the web the fix would be live in 20 minutes. On iOS the fix is built, uploaded and waits for review (often under a day, longer after a rejection), then rolls out, and users on automatic updates get it over the following days. A server-side switch that hides the payment button would have stopped the damage in a minute.",
        nuance: "Review time and rejection risk sit on the critical path of every fix. Keep server-side switches for anything you may need to turn off quickly, because a hotfix still waits in the queue.",
        read: [{ label: "Apple: App Review Guidelines, sections 2 Performance and 3 Business", url: "https://developer.apple.com/app-store/review/guidelines/", m: 30 }],
        tags: ["app store", "google play", "app review", "testflight", "in-app purchase", "fastlane"] },
      { id: "releases", name: "Releases, rollouts and feature flags",
        line: "Shipping to a few users first, because a bad build cannot be recalled.",
        body: [
          "Once installed, an app version stays on devices until the user updates, so a mobile release cannot be rolled back like a web deploy. Teams limit the blast radius instead. **Staged rollouts** on Google Play release to a percentage of users and can be halted; Apple's **phased release** reaches 1%, 2%, 5%, 10%, 20%, 50% and then 100% of automatic updaters over seven days.",
          "**Feature flags** let new code ship switched off and be turned on remotely, per user or percentage. Most teams also keep a minimum supported version on the server that makes very old builds update."
        ],
        uses: [
          "**LaunchDarkly, Statsig and Firebase Remote Config**: switch features per user, percentage or app version without a release.",
          "**Expo EAS Update**: pushes JavaScript and asset fixes to React Native apps over the air, after Microsoft retired CodePush in 2025."
        ],
        example: "Version 5.2 goes to 1% of Android users on Tuesday. By Wednesday its crash-free rate is 98.9% against 99.7% for 5.1, and every new crash is in the new checkout. The team halts the rollout and turns off the `new_checkout` flag. The 1% who installed 5.2 fall back to the old checkout at the next config fetch, with no update needed.",
        nuance: "Halting a rollout stops new installs but does not remove the build from people who already have it. The real undo is a flag that was in place before you needed it.",
        read: [
          { label: "Google Play Console Help: release app updates with staged rollouts", url: "https://support.google.com/googleplay/android-developer/answer/6346149", m: 5 },
          { label: "App Store Connect Help: release a version update in phases", url: "https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases", m: 5 }
        ],
        tags: ["staged rollout", "phased release", "feature flags", "remote config", "ota", "eas update"] },
      { id: "crash-analytics", name: "Crash reporting and analytics",
        line: "Knowing what broke on devices you will never see, and what users actually do.",
        body: [
          "When an app crashes on a user's phone, a crash reporter saves the stack trace and device details and uploads them on next launch. Release builds are stripped and obfuscated, so traces must be **symbolicated** with the dSYM files (iOS) or R8 mapping files (Android) from that build. Crashes are grouped into issues and ranked by how many users they hit; the headline number is the share of users with no crash.",
          "**Product analytics** record events to show funnels, retention and the effect of an experiment. Apple's App Tracking Transparency requires consent to track users across other companies' apps."
        ],
        uses: [
          "**Firebase Crashlytics and Sentry**: collect, symbolicate and group crashes, with a crash-free rate for each release.",
          "**Amplitude, Mixpanel and PostHog**: product analytics for funnels, retention and experiments.",
          "**Xcode Organizer and the Play Console**: show crashes the platforms collect themselves from users who agreed to share diagnostics."
        ],
        example: "A crash arrives as a raw address such as `MyApp 0x0000000104a3c1f8`, which says nothing. Matched against that build's dSYM, it becomes `CheckoutViewModel.applyCoupon(_:)`, line 88: a force-unwrap of a missing coupon. Crashlytics groups 1,240 such reports from 310 users into one issue, so it is fixed once and checked in the next release's crash-free rate.",
        nuance: "Missing symbol files make crash reports unreadable exactly when you need them. Upload them in CI with every release build, and compare crash rates per release, so a regression shows within hours.",
        read: [{ label: "Firebase docs: Crashlytics", url: "https://firebase.google.com/docs/crashlytics", m: 10 }],
        tags: ["crashlytics", "sentry", "symbolication", "dsym", "analytics", "att"] }
    ] }
  ]
});

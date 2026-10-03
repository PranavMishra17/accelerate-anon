/* What to read and watch for each topic in the mobile field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("mobile", {
 "ios-native": [
  {
   "kind": "video",
   "req": true,
   "label": "Swift in 100 seconds",
   "url": "https://www.youtube.com/watch?v=nAchMctX4YA",
   "m": 3,
   "why": "The language's main features at a glance.",
   "yt": {
    "id": "nAchMctX4YA",
    "ch": "Fireship"
   }
  },
  {
   "kind": "keep",
   "src": "course",
   "req": false,
   "label": "Hacking with Swift: 100 Days of SwiftUI, the first SwiftUI projects",
   "url": "https://www.hackingwithswift.com/100/swiftui",
   "m": 60,
   "why": "A free structured course; do the first projects for SwiftUI basics."
  }
 ],
 "android-native": [
  {
   "kind": "video",
   "req": true,
   "label": "Kotlin in 100 seconds",
   "url": "https://www.youtube.com/watch?v=xT8oP0wy-A0",
   "m": 3,
   "why": "Kotlin's main features at a glance.",
   "yt": {
    "id": "xT8oP0wy-A0",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: thinking in Compose",
   "url": "https://developer.android.com/develop/ui/compose/mental-model",
   "m": 15,
   "why": "UI as a function of state, and recomposition."
  }
 ],
 "react-native": [
  {
   "kind": "video",
   "req": true,
   "label": "React Native in 100 seconds",
   "url": "https://www.youtube.com/watch?v=gvkqT_Uoahw",
   "m": 3,
   "why": "How React components map to native views.",
   "yt": {
    "id": "gvkqT_Uoahw",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "React Native docs: about the New Architecture",
   "url": "https://reactnative.dev/architecture/landing-page",
   "m": 15,
   "why": "How JS and native talk without the old bridge."
  }
 ],
 "flutter": [
  {
   "kind": "video",
   "req": true,
   "label": "Flutter in 100 seconds",
   "url": "https://www.youtube.com/watch?v=lHhRhPV--G0",
   "m": 3,
   "why": "Widgets, Dart and why Flutter draws its own pixels.",
   "yt": {
    "id": "lHhRhPV--G0",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Flutter docs: architectural overview",
   "url": "https://docs.flutter.dev/resources/architectural-overview",
   "m": 30,
   "why": "The layers from framework to engine."
  }
 ],
 "kmp": [
  {
   "kind": "video",
   "req": true,
   "label": "What is Kotlin Multiplatform and how does it work?",
   "url": "https://www.youtube.com/watch?v=RSBO1C_Du2U",
   "m": 11,
   "yt": {
    "id": "RSBO1C_Du2U",
    "ch": "Philipp Lackner"
   },
   "why": "How shared Kotlin compiles to JVM and native, and what is shared versus native UI."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Get started with Kotlin Multiplatform",
   "url": "https://www.youtube.com/watch?v=gP5Y-ct6QXI",
   "m": 18,
   "yt": {
    "id": "gP5Y-ct6QXI",
    "ch": "Android Developers"
   },
   "why": "Official walk through sharing logic across Android and iOS."
  },
  {
   "kind": "keep",
   "src": "tutorial",
   "req": true,
   "label": "Kotlin docs: Kotlin Multiplatform, get started",
   "url": "https://kotlinlang.org/docs/multiplatform/get-started.html",
   "m": 10,
   "why": "Build a first shared module for iOS and Android."
  }
 ],
 "app-lifecycle": [
  {
   "kind": "video",
   "req": true,
   "label": "The Activity lifecycle explained",
   "url": "https://www.youtube.com/watch?v=UJN3AL4tiqw",
   "m": 9,
   "yt": {
    "id": "UJN3AL4tiqw",
    "ch": "Coding in Flow"
   },
   "why": "Walks onCreate through onDestroy and what triggers each, including rotation."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Activities and the Activity lifecycle",
   "url": "https://www.youtube.com/watch?v=SJw3Nu_h8kk",
   "m": 13,
   "yt": {
    "id": "SJw3Nu_h8kk",
    "ch": "Philipp Lackner"
   },
   "why": "Shows the lifecycle callbacks running live, with state saving."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: the activity lifecycle",
   "url": "https://developer.android.com/guide/components/activities/activity-lifecycle",
   "m": 20,
   "why": "The states an activity passes through and the callbacks for each."
  }
 ],
 "background-work": [
  {
   "kind": "video",
   "req": true,
   "label": "All 4 types of background work on Android explained",
   "url": "https://www.youtube.com/watch?v=gI7cvPVWZ7w",
   "m": 17,
   "yt": {
    "id": "gI7cvPVWZ7w",
    "ch": "Philipp Lackner"
   },
   "why": "Foreground services, WorkManager and the other options, framed as mobile system design."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: persistent work with WorkManager",
   "url": "https://developer.android.com/develop/background-work/background-tasks/persistent",
   "m": 10,
   "why": "Work that must finish even if the app or device restarts."
  }
 ],
 "push-notifications": [
  {
   "kind": "video",
   "req": true,
   "label": "Push notifications in 2026: Expo, APNs and FCM basics",
   "url": "https://www.youtube.com/watch?v=dB-gkYdTi3o",
   "m": 19,
   "yt": {
    "id": "dB-gkYdTi3o",
    "ch": "Code with Beto"
   },
   "why": "Device token, APNs and FCM roles, and how a push reaches a closed app."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Firebase docs: Cloud Messaging overview",
   "url": "https://firebase.google.com/docs/cloud-messaging",
   "m": 10,
   "why": "How a message goes from your server to a device."
  }
 ],
 "deep-links": [
  {
   "kind": "video",
   "req": true,
   "label": "Part 1: Introduction to deep links",
   "url": "https://www.youtube.com/watch?v=1qFIg-lz4Ys",
   "m": 7,
   "yt": {
    "id": "1qFIg-lz4Ys",
    "ch": "Android Developers"
   },
   "why": "What deep links and App Links are and how verification opens the app directly."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Universal Links and Apple App Site Association (AASA)",
   "url": "https://www.youtube.com/watch?v=oJaxHabyp-4",
   "m": 9,
   "yt": {
    "id": "oJaxHabyp-4",
    "ch": "iCode"
   },
   "why": "The iOS side: the AASA file on your domain and how to debug it."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: about App Links",
   "url": "https://developer.android.com/training/app-links",
   "m": 10,
   "why": "Verified links that open your app directly."
  }
 ],
 "offline-sync": [
  {
   "kind": "video",
   "req": true,
   "label": "Create offline-first apps",
   "url": "https://www.youtube.com/watch?v=jaZ2gLMGUsM",
   "m": 6,
   "yt": {
    "id": "jaZ2gLMGUsM",
    "ch": "Android Developers"
   },
   "why": "Local database as source of truth, with sync running in the background."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Local-first vs offline-first in 100 seconds",
   "url": "https://www.youtube.com/watch?v=kjOx-Le5gB8",
   "m": 3,
   "yt": {
    "id": "kjOx-Le5gB8",
    "ch": "PowerSync"
   },
   "why": "The difference in who holds the truth and how syncing follows."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: build an offline-first app",
   "url": "https://developer.android.com/topic/architecture/data-layer/offline-first",
   "m": 20,
   "why": "A local database as the source of truth, synced in the background."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Ink & Switch: local-first software, the sections on CRDTs",
   "url": "https://www.inkandswitch.com/essay/local-first/",
   "m": 25,
   "why": "The idea behind merging edits made offline."
  }
 ],
 "networking": [
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: optimize network access",
   "url": "https://developer.android.com/develop/connectivity/network-ops/network-access-optimization",
   "m": 10,
   "why": "Batching, caching and retry choices that save battery and survive bad networks."
  }
 ],
 "mobile-security": [
  {
   "kind": "video",
   "req": false,
   "label": "Full guide to encryption and decryption in Android (Keystore, ciphers)",
   "url": "https://www.youtube.com/watch?v=aaSck7jBDbw",
   "m": 28,
   "yt": {
    "id": "aaSck7jBDbw",
    "ch": "Philipp Lackner"
   },
   "why": "A hands-on use of the Keystore for protecting data on the device."
  },
  {
   "kind": "read",
   "req": true,
   "label": "OWASP: Mobile Application Security Verification Standard (MASVS)",
   "url": "https://mas.owasp.org/MASVS/",
   "m": 20,
   "why": "The checklist for storage, crypto, auth and network on a phone."
  }
 ],
 "performance-battery": [
  {
   "kind": "video",
   "req": true,
   "label": "Measuring jank and startup with Macrobenchmark",
   "url": "https://www.youtube.com/watch?v=0adLO2VRJtc",
   "m": 11,
   "yt": {
    "id": "0adLO2VRJtc",
    "ch": "Android Developers"
   },
   "why": "How to measure cold start and dropped frames instead of guessing."
  },
  {
   "kind": "video",
   "req": false,
   "label": "This is how you measure the performance of your Android app",
   "url": "https://www.youtube.com/watch?v=XHz_cFwdfoM",
   "m": 22,
   "yt": {
    "id": "XHz_cFwdfoM",
    "ch": "Philipp Lackner"
   },
   "why": "Profiling, startup and frame metrics on a real app."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Android Developers: Android vitals",
   "url": "https://developer.android.com/topic/performance/vitals",
   "m": 10,
   "why": "The crash, ANR and battery metrics Google Play tracks."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Android Developers: app startup time",
   "url": "https://developer.android.com/topic/performance/vitals/launch-time",
   "m": 15,
   "why": "Cold, warm and hot starts and how to speed them."
  }
 ],
 "on-device-ml": [
  {
   "kind": "video",
   "req": true,
   "label": "WWDC24: Deploy machine learning and AI models on-device with Core ML",
   "url": "https://www.youtube.com/watch?v=aawk4l9W9YU",
   "m": 19,
   "yt": {
    "id": "aawk4l9W9YU",
    "ch": "Apple Developer"
   },
   "why": "Converting, compressing and running models on the Neural Engine with Core ML."
  },
  {
   "kind": "video",
   "req": false,
   "label": "LiteRT: the universal framework for on-device AI",
   "url": "https://www.youtube.com/watch?v=A5qHo1wsz3A",
   "m": 7,
   "yt": {
    "id": "A5qHo1wsz3A",
    "ch": "Think AI "
   },
   "why": "The Android and cross-platform counterpart to Core ML."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google AI Edge: LiteRT overview",
   "url": "https://developers.google.com/edge/litert",
   "m": 10,
   "why": "Running a model on an Android device."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Apple Developer: machine learning, Core ML and the Foundation Models framework",
   "url": "https://developer.apple.com/machine-learning/",
   "m": 10,
   "why": "The Apple side of the same idea."
  }
 ],
 "app-store": [
  {
   "kind": "video",
   "req": false,
   "label": "Why my app was rejected and how I got it approved: App Store review explained",
   "url": "https://www.youtube.com/watch?v=gvQiTtUU_LE",
   "m": 6,
   "yt": {
    "id": "gvQiTtUU_LE",
    "ch": "Think Like an Engineer"
   },
   "why": "How review works and what typically triggers a rejection."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Why apps get rejected from the App Store: common reasons",
   "url": "https://www.youtube.com/watch?v=CGW3_eRM1G0",
   "m": 18,
   "yt": {
    "id": "CGW3_eRM1G0",
    "ch": "Noah Does Coding"
   },
   "why": "Concrete guideline problems to check before submitting."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Apple: App Review Guidelines, sections 2 Performance and 3 Business",
   "url": "https://developer.apple.com/app-store/review/guidelines/",
   "m": 30,
   "why": "The rules a build is reviewed against."
  }
 ],
 "releases": [
  {
   "kind": "video",
   "req": false,
   "label": "What are feature flags?",
   "url": "https://www.youtube.com/watch?v=AJa2B-twtG4",
   "m": 7,
   "yt": {
    "id": "AJa2B-twtG4",
    "ch": "IBM Technology"
   },
   "why": "Ship code switched off and turn it on for a percentage of users, the safety net a mobile app needs."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google Play Console Help: release app updates with staged rollouts",
   "url": "https://support.google.com/googleplay/android-developer/answer/6346149",
   "m": 5,
   "why": "Roll out to a percentage of users and halt if it goes wrong."
  },
  {
   "kind": "read",
   "req": false,
   "label": "App Store Connect Help: release a version update in phases",
   "url": "https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases",
   "m": 5,
   "why": "The iOS equivalent: a seven-day phased release."
  }
 ],
 "crash-analytics": [
  {
   "kind": "video",
   "req": true,
   "label": "Firebase Crashlytics intro",
   "url": "https://www.youtube.com/watch?v=Ire9yQg4OFA",
   "m": 9,
   "yt": {
    "id": "Ire9yQg4OFA",
    "ch": "The Android Factory"
   },
   "why": "What a crash reporter collects and how crashes are grouped into issues."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Firebase Crashlytics: custom crash reporting",
   "url": "https://www.youtube.com/watch?v=JxVYfZprK0g",
   "m": 14,
   "yt": {
    "id": "JxVYfZprK0g",
    "ch": "The Android Factory"
   },
   "why": "Adding keys, logs and non-fatal reports for better triage."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Firebase docs: Crashlytics",
   "url": "https://firebase.google.com/docs/crashlytics",
   "m": 10,
   "why": "Setting up crash reports and reading them."
  }
 ]
});

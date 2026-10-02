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
   "kind": "read",
   "req": true,
   "label": "Firebase docs: Crashlytics",
   "url": "https://firebase.google.com/docs/crashlytics",
   "m": 10,
   "why": "Setting up crash reports and reading them."
  }
 ]
});

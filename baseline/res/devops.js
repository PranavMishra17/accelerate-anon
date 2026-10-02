/* What to read and watch for each topic in the devops field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("devops", {
 "version-control": [
  {
   "kind": "video",
   "req": true,
   "label": "Git explained in 100 seconds",
   "url": "https://www.youtube.com/watch?v=hwP7WQkmECE",
   "m": 2,
   "why": "What a commit, a branch and a merge are, in the shortest form.",
   "yt": {
    "id": "hwP7WQkmECE",
    "ch": "Fireship"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "Continuous Integration vs Feature Branch Workflow",
   "url": "https://www.youtube.com/watch?v=pXovk-5J0Lg",
   "m": 18,
   "why": "The case for small, frequent merges to one trunk, from the author of Continuous Delivery.",
   "yt": {
    "id": "pXovk-5J0Lg",
    "ch": "GOTO Conferences"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "trunkbaseddevelopment.com: the introduction",
   "url": "https://trunkbaseddevelopment.com/",
   "m": 10,
   "why": "The practice laid out: short-lived branches, flags, and release from trunk."
  },
  {
   "kind": "read",
   "req": false,
   "label": "DORA: the software delivery performance metrics",
   "url": "https://dora.dev/guides/dora-metrics-four-keys/",
   "m": 10,
   "why": "The four numbers that show whether this way of working pays off."
  }
 ],
 "ci-cd": [
  {
   "kind": "video",
   "req": true,
   "label": "DevOps CI/CD explained in 100 seconds",
   "url": "https://www.youtube.com/watch?v=scEDHsr3APg",
   "m": 2,
   "why": "Build, test and deploy on every push, as one picture.",
   "yt": {
    "id": "scEDHsr3APg",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Martin Fowler: Continuous Integration (2024 revision)",
   "url": "https://martinfowler.com/articles/continuousIntegration.html",
   "m": 35,
   "why": "The definition of CI and the habits that make it work."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Top 10 rules for continuous integration",
   "url": "https://www.youtube.com/watch?v=Xl62gQpAl1w",
   "m": 18,
   "why": "Practical rules for a team that wants a green main branch.",
   "yt": {
    "id": "Xl62gQpAl1w",
    "ch": "Modern Software Engineering"
   }
  }
 ],
 "deployment-strategies": [
  {
   "kind": "read",
   "req": true,
   "label": "Martin Fowler: BlueGreenDeployment",
   "url": "https://martinfowler.com/bliki/BlueGreenDeployment.html",
   "m": 4,
   "why": "Two identical environments and a switch between them."
  },
  {
   "kind": "read",
   "req": true,
   "label": "Danilo Sato: CanaryRelease",
   "url": "https://martinfowler.com/bliki/CanaryRelease.html",
   "m": 6,
   "why": "Send a small share of traffic to the new version first."
  },
  {
   "kind": "video",
   "req": false,
   "label": "What are deployment strategies? Blue green vs canary vs rolling vs A/B deployment",
   "url": "https://www.youtube.com/watch?v=nW8nwK5Mck4",
   "m": 14,
   "why": "All four side by side with diagrams, if the articles do not click.",
   "yt": {
    "id": "nW8nwK5Mck4",
    "ch": "Server Gyan"
   }
  }
 ],
 "feature-flags": [
  {
   "kind": "video",
   "req": true,
   "label": "Feature flags are more than just toggles",
   "url": "https://www.youtube.com/watch?v=2lAF3_vd0k0",
   "m": 10,
   "why": "Release flags, ops flags and experiments are different things.",
   "yt": {
    "id": "2lAF3_vd0k0",
    "ch": "CodeOpinion"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Pete Hodgson: Feature Toggles (aka Feature Flags), the categories section",
   "url": "https://martinfowler.com/articles/feature-toggles.html",
   "m": 25,
   "why": "The four kinds of flag and how long each should live."
  }
 ],
 "containers": [
  {
   "kind": "video",
   "req": true,
   "label": "Docker in 100 seconds",
   "url": "https://www.youtube.com/watch?v=Gjnup-PuquQ",
   "m": 3,
   "why": "Dockerfile, image and container in one pass.",
   "yt": {
    "id": "Gjnup-PuquQ",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Docker docs: Docker overview (images, containers, registries)",
   "url": "https://docs.docker.com/get-started/docker-overview/",
   "m": 12,
   "why": "The official picture of images, containers and registries."
  },
  {
   "kind": "video",
   "req": false,
   "label": "The difference between containers and virtual machines",
   "url": "https://www.youtube.com/watch?v=RAaU-Q5LN9s",
   "m": 10,
   "why": "Why a container shares the host kernel and a VM does not.",
   "yt": {
    "id": "RAaU-Q5LN9s",
    "ch": "Christian Lempa"
   }
  }
 ],
 "kubernetes": [
  {
   "kind": "video",
   "req": true,
   "label": "Kubernetes explained in 100 seconds",
   "url": "https://www.youtube.com/watch?v=PziYflu8cB8",
   "m": 3,
   "why": "Cluster, nodes, pods and the control plane at a glance.",
   "yt": {
    "id": "PziYflu8cB8",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Kubernetes docs: overview, what it is and is not",
   "url": "https://kubernetes.io/docs/concepts/overview/",
   "m": 8,
   "why": "Declared state against actual state: the control loop idea."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Kubernetes pods, ReplicaSets, and deployments in 5 minutes",
   "url": "https://www.youtube.com/watch?v=iC-WxZGhFqs",
   "m": 5,
   "why": "How a Deployment keeps the number of pods you asked for.",
   "yt": {
    "id": "iC-WxZGhFqs",
    "ch": "Containers from the Couch"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Kubernetes docs: Horizontal Pod Autoscaling",
   "url": "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/",
   "m": 15,
   "why": "How the loop scales replicas from a metric."
  }
 ],
 "infrastructure-as-code": [
  {
   "kind": "video",
   "req": true,
   "label": "Terraform in 100 seconds",
   "url": "https://www.youtube.com/watch?v=tomUWcQ0P3k",
   "m": 3,
   "why": "Declare resources in files; Terraform works out what to create.",
   "yt": {
    "id": "tomUWcQ0P3k",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "HashiCorp: What is Terraform (write, plan, apply, state)",
   "url": "https://developer.hashicorp.com/terraform/intro",
   "m": 10,
   "why": "The write, plan, apply loop and why state exists."
  }
 ],
 "config-and-secrets": [
  {
   "kind": "read",
   "req": true,
   "label": "The Twelve-Factor App: III, config",
   "url": "https://12factor.net/config",
   "m": 4,
   "why": "Why config lives in the environment and not in the code."
  }
 ],
 "observability": [
  {
   "kind": "video",
   "req": true,
   "label": "Observability and its pillars explained: logs, metrics and traces simplified",
   "url": "https://www.youtube.com/watch?v=rJfZyA831fI",
   "m": 7,
   "why": "What each signal answers and why you want all three.",
   "yt": {
    "id": "rJfZyA831fI",
    "ch": "OpenObserve"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "OpenTelemetry: observability primer",
   "url": "https://opentelemetry.io/docs/concepts/observability-primer/",
   "m": 10,
   "why": "The vendor-neutral vocabulary: signals, instrumentation, context."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google SRE book, ch. 6: Monitoring Distributed Systems (the four golden signals)",
   "url": "https://sre.google/sre-book/monitoring-distributed-systems/",
   "m": 25,
   "why": "Latency, traffic, errors, saturation: what to watch first."
  }
 ],
 "slos-error-budgets": [
  {
   "kind": "video",
   "req": true,
   "label": "SLIs, SLOs, SLAs, oh my! (class SRE implements DevOps)",
   "url": "https://www.youtube.com/watch?v=tEylFyxbDLE",
   "m": 9,
   "why": "The three terms and how they fit together, from Google Cloud.",
   "yt": {
    "id": "tEylFyxbDLE",
    "ch": "Google Cloud Tech"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google SRE book, ch. 4: Service Level Objectives",
   "url": "https://sre.google/sre-book/service-level-objectives/",
   "m": 25,
   "why": "How to pick indicators and set a target."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google SRE book, ch. 3: Embracing Risk (error budgets)",
   "url": "https://sre.google/sre-book/embracing-risk/",
   "m": 25,
   "why": "Why 100 percent is the wrong target and what the budget buys."
  }
 ],
 "alerting": [
  {
   "kind": "video",
   "req": true,
   "label": "Alerting on error budget burn rate",
   "url": "https://www.youtube.com/watch?v=t1BGo-Il1AM",
   "m": 6,
   "why": "Alert on how fast the budget is burning, not on raw errors.",
   "yt": {
    "id": "t1BGo-Il1AM",
    "ch": "Google Cloud Tech"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google SRE workbook: Alerting on SLOs (burn rates, multiwindow)",
   "url": "https://sre.google/workbook/alerting-on-slos/",
   "m": 30,
   "why": "Fast and slow burn alerts with the numbers worked out."
  },
  {
   "kind": "video",
   "req": false,
   "label": "SLO burn: reducing alert fatigue and maintenance cost in systems of any size",
   "url": "https://www.youtube.com/watch?v=idkopV6LR5U",
   "m": 44,
   "why": "A LISA18 talk; watch the first 20 minutes for the burn alert idea.",
   "yt": {
    "id": "idkopV6LR5U",
    "ch": "USENIX"
   }
  }
 ],
 "incident-response": [
  {
   "kind": "video",
   "req": true,
   "label": "Postmortem culture at Google: how do we learn from failures and how can you too?",
   "url": "https://www.youtube.com/watch?v=y-wrnN-gtkQ",
   "m": 16,
   "why": "What a blameless postmortem looks like in practice.",
   "yt": {
    "id": "y-wrnN-gtkQ",
    "ch": "Open conf"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google SRE book, ch. 14: Managing Incidents",
   "url": "https://sre.google/sre-book/managing-incidents/",
   "m": 20,
   "why": "Roles, a command post, and handoffs during an incident."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Google SRE book, ch. 15: Postmortem Culture",
   "url": "https://sre.google/sre-book/postmortem-culture/",
   "m": 20,
   "why": "Writing the postmortem and keeping it blameless."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Postmortem culture at Google (Conf42 SRE 2022)",
   "url": "https://www.youtube.com/watch?v=qgHWzQ2zcqQ",
   "m": 24,
   "why": "A second take with examples of what goes in the document.",
   "yt": {
    "id": "qgHWzQ2zcqQ",
    "ch": "Conf42"
   }
  }
 ],
 "on-call": [
  {
   "kind": "read",
   "req": true,
   "label": "Google SRE book, ch. 11: Being On-Call",
   "url": "https://sre.google/sre-book/being-on-call/",
   "m": 20,
   "why": "How to keep a rotation sustainable: load, rest and escalation."
  }
 ],
 "owasp-top-10": [
  {
   "kind": "read",
   "req": true,
   "label": "OWASP Top 10:2025: the category pages",
   "url": "https://top10.owasp.org/2025",
   "m": 30,
   "why": "Read the entries for broken access control, injection and supply chain failures first."
  }
 ],
 "threat-modelling": [
  {
   "kind": "read",
   "req": true,
   "label": "Threat Modeling Manifesto: values, principles and the four questions",
   "url": "https://www.threatmodelingmanifesto.org/",
   "m": 10,
   "why": "What are we building, what can go wrong, what do we do, did we do enough."
  }
 ],
 "supply-chain": [
  {
   "kind": "read",
   "req": true,
   "label": "SLSA: the framework overview and levels",
   "url": "https://slsa.dev/",
   "m": 15,
   "why": "The levels that describe how trustworthy a build is."
  }
 ],
 "secrets-scanning": [
  {
   "kind": "read",
   "req": true,
   "label": "GitHub docs: about secret scanning",
   "url": "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning",
   "m": 8,
   "why": "How leaked keys are detected, and push protection."
  }
 ],
 "zero-trust": [
  {
   "kind": "read",
   "req": true,
   "label": "NIST SP 800-207: Zero Trust Architecture",
   "url": "https://csrc.nist.gov/pubs/sp/800/207/final",
   "m": 15,
   "why": "The reference definition; read the tenets and the logical components."
  }
 ]
});

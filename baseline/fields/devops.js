BASELINE.field({
  id: "devops", name: "DevOps, security and reliability", short: "DevOps", layer: "Building",
  ink: "#5E6B2F", inkDark: "#B8C47F",
  lede: "The practice of getting code from a commit into production often and safely, keeping it running, and keeping attackers out.",
  overview: [
    "DevOps started as a culture change: the people who write software also own shipping and running it, instead of throwing it over a wall to an operations team. It became a toolchain: version control, a CI pipeline that tests every change, containers as the unit of delivery, Kubernetes or a managed platform to run them, infrastructure written as code, and telemetry that tells you when something is wrong. The job titles are DevOps engineer, platform engineer, site reliability engineer (SRE) and security engineer, and on most small teams every backend engineer does some of each.",
    "It joins the other Building fields at the point of delivery. The backend is what gets shipped, the cloud is where it lands, and distributed systems explain why it fails in strange ways. Reliability is measured: Google's SRE practice turned \"is it up\" into service level objectives and error budgets, now standard across the industry. Security has moved left into the same pipeline: dependency scanning, secret scanning, signed builds and least-privilege access, after supply chain attacks such as SolarWinds, Log4Shell and the xz backdoor showed how much of an app is other people's code.",
    "The map reads as a loop. A commit goes through the pipeline into a running cluster, the cluster emits telemetry, telemetry is judged against objectives, and a breached objective pages a human. What the incident teaches goes back into the next commit."
  ],
  diagram: {
    nodes: [
      { id: "version-control", label: "Version control", sub: "trunk, small commits", col: 0, row: 0 },
      { id: "ci-cd", label: "CI pipeline", sub: "build, test, scan", col: 0, row: 1 },
      { id: "containers", label: "Container image", sub: "pushed to a registry", col: 0, row: 2 },
      { id: "infrastructure-as-code", label: "Infrastructure as code", sub: "the cluster in Terraform", col: 1, row: 0 },
      { id: "kubernetes", label: "Kubernetes", sub: "runs and heals pods", col: 1, row: 1 },
      { id: "deployment-strategies", label: "Rollout", sub: "canary, blue-green", col: 1, row: 2 },
      { id: "observability", label: "Telemetry", sub: "logs, metrics, traces", col: 2, row: 0 },
      { id: "slos-error-budgets", label: "SLOs", sub: "the budget for failure", col: 2, row: 1 },
      { id: "alerting", label: "Alerts", sub: "page on budget burn", col: 2, row: 2 },
      { id: "incident-response", label: "Incident", sub: "mitigate, then learn", col: 2, row: 3 }
    ],
    edges: [
      ["version-control", "ci-cd", "on every push"], ["ci-cd", "containers", "builds"],
      ["containers", "deployment-strategies", "released by"], ["infrastructure-as-code", "kubernetes", "provisions"],
      ["deployment-strategies", "kubernetes", "updates"], ["kubernetes", "observability", "emits"],
      ["observability", "slos-error-budgets", "measured as"], ["slos-error-budgets", "alerting", "breach fires"],
      ["alerting", "incident-response", "pages"]
    ],
    cap: "**A change travels from a commit to a running cluster, and the cluster reports back.** The left column is delivery, the middle is the platform that runs it, the right is how you know it works. The loop closes outside the map: an incident's postmortem becomes the next commit. Click a box to open it."
  },
  start: [
    { label: "Google SRE book: ch. 3 Embracing Risk, ch. 4 Service Level Objectives, ch. 6 Monitoring Distributed Systems", url: "https://sre.google/sre-book/table-of-contents/", m: 75,
      why: "Free, and the source of the vocabulary everyone now uses: SLOs, error budgets, the four golden signals." },
    { label: "The Twelve-Factor App: all twelve factors", url: "https://12factor.net/", m: 30,
      why: "Short rules for an app that deploys cleanly: config in the environment, stateless processes, logs as streams." },
    { label: "Kubernetes basics: the six interactive modules", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", m: 60,
      why: "Deploy, expose, scale and roll out an app on a real cluster, which makes pods, deployments and services concrete." },
    { label: "OWASP Top 10:2025: the ten categories", url: "https://top10.owasp.org/2025", m: 30,
      why: "The shared list of how web apps actually get breached, ranked from real data." }
  ],
  clusters: [
    { name: "Shipping changes", line: "From a commit to production: integrate often, test automatically, release gradually.",
      topics: [
        { id: "version-control", name: "Version control and trunk-based development",
          line: "Everyone merges small changes to one main branch at least daily, keeping it releasable.",
          body: [
            "Git records every change as a commit in a history anyone can branch from and merge back into. How a team branches is the real decision. **Trunk-based development** keeps one main branch; people work on short-lived branches, a day or two at most, merged often, so the trunk is always close to releasable. Unfinished features hide behind feature flags.",
            "The alternative, long-lived feature branches merged near a release, produces large merges and integration bugs found late. DORA's research links trunk-based work with higher deployment frequency and lower change failure rates."
          ],
          uses: [
            "**Google and Meta monorepos**: thousands of engineers commit to one trunk, with build tooling that tests only what each change affects.",
            "**GitHub flow**: branch, open a pull request, review, merge to main; the common small-team form of trunk-based work.",
            "**DORA metrics**: lead time, deploy frequency, recovery time, change fail rate and rework rate show whether the branching model is working."
          ],
          example: "Two teams, one month. Team A merges a feature branch after three weeks: 2,000 changed lines, 40 conflicts, two days of fixing, and a bug from code nobody saw together until release. Team B merges 15 small pull requests behind a flag, each under 150 lines and reviewed within the hour. The flag turns on when the last one lands.",
          nuance: "Trunk-based only works with fast, trusted tests. Without a CI suite that catches breakage in minutes, merging daily spreads bugs to everyone at once instead of preventing them.",
          read: [
            { label: "trunkbaseddevelopment.com: the introduction", url: "https://trunkbaseddevelopment.com/", m: 10 },
            { label: "DORA: the software delivery performance metrics", url: "https://dora.dev/guides/dora-metrics-four-keys/", m: 10 }
          ],
          tags: ["git", "trunk", "branching", "monorepo", "dora"] },
        { id: "ci-cd", name: "CI/CD",
          line: "Every push is built and tested automatically; passing changes deploy without manual steps.",
          body: [
            "**Continuous integration** means every push triggers an automated build and test run, and a broken main branch is fixed before anything else. **Continuous delivery** means every passing change produces a release artifact that could go to production at the press of a button; **continuous deployment** removes the button.",
            "A pipeline is stages defined as code next to the app: lint and type-check, unit tests, build an image, scan it, integration tests, deploy to staging, then production. Fast feedback is the point: a pipeline that takes an hour gets skipped or batched, and batching is what CI exists to prevent."
          ],
          uses: [
            "**GitHub Actions**: runs workflows from `.github/workflows/` on every push and pull request, and blocks the merge until required checks pass.",
            "**GitLab CI, Buildkite and CircleCI**: run pipelines for teams that want their own runners, large parallel test fleets or self-hosting.",
            "**Large engineering companies**: deploy each service many times a day, because each change is small and the pipeline is trusted."
          ],
          example: "A push to a pull request starts four parallel jobs: lint (40 s), type-check (1 min), unit tests (3 min), build and scan the image (4 min). Green after about 4 minutes; merge. On `main` the same image goes to staging, is smoke-tested, then is promoted to production by its digest, so what was tested is exactly what ships.",
          nuance: "A flaky test is worse than no test: people learn to re-run until green, and then ignore real failures. Quarantine or fix flaky tests at once, and keep the critical path short enough to wait for.",
          read: [{ label: "Martin Fowler: Continuous Integration (2024 revision)", url: "https://martinfowler.com/articles/continuousIntegration.html", m: 35 }],
          tags: ["ci", "cd", "github actions", "pipeline", "build"] },
        { id: "deployment-strategies", name: "Deployment strategies",
          line: "Rolling, blue-green and canary: ways to release so a bad version hurts few users.",
          body: [
            "A **rolling** deployment replaces instances a few at a time; it is Kubernetes' default. **Blue-green** runs two full environments: deploy to the idle one, test it, switch traffic, and switch back to roll back in seconds. A **canary** sends a small share of traffic (1%, then 10%, then all) to the new version, compares its error rate and latency with the old, and stops if they worsen.",
            "All three need the old version to keep running, so database migrations must be backward compatible: add a column, deploy code that uses it, drop the old one later (expand, then contract)."
          ],
          uses: [
            "**Argo Rollouts and Flagger**: automate canaries on Kubernetes, shifting traffic in steps and rolling back when metrics cross a threshold.",
            "**AWS CodeDeploy**: runs blue-green deployments for EC2, ECS and Lambda, moving traffic between two target groups or function versions.",
            "**CrowdStrike, July 2024**: a content update pushed to every machine at once, rather than staged, crashed about 8.5 million Windows computers."
          ],
          example: "Version 2 gets 1% of traffic for 15 minutes. Its error rate is 0.4% against version 1's 0.1%, past the agreed threshold of double, so the rollout controller sets its weight back to zero. About 1% of users saw a few failed requests for 15 minutes, instead of every user seeing them after a full rollout.",
          nuance: "Staging rarely matches production's data, traffic and scale, so the canary is often the first real test. Treat configuration and content pushes as deploys too: they cause as many outages as code.",
          read: [
            { label: "Martin Fowler: BlueGreenDeployment", url: "https://martinfowler.com/bliki/BlueGreenDeployment.html", m: 4 },
            { label: "Danilo Sato: CanaryRelease", url: "https://martinfowler.com/bliki/CanaryRelease.html", m: 6 }
          ],
          tags: ["canary", "blue-green", "rolling", "rollback", "migration"] },
        { id: "feature-flags", name: "Feature flags",
          line: "Ship code turned off, then turn it on for chosen users without a deploy.",
          body: [
            "A feature flag is a runtime switch around a code path, read from a flag service or config. It separates **deploy** (the code is in production) from **release** (users see it). **Release** flags hide unfinished work on the trunk, **experiment** flags split users for A/B tests, **ops** flags let on-call turn off an expensive feature under load, and **permission** flags gate features to beta users or paid plans.",
            "Flags allow rollout by user rather than by server: staff first, then 5%, then everyone, with an off switch that needs no rollback."
          ],
          uses: [
            "**LaunchDarkly, Statsig and Unleash**: flag services that evaluate rules per user inside the SDK, so a dashboard change takes effect in seconds.",
            "**Knight Capital, 2012**: lost more than $400 million in under an hour when an old flag was reused and one server still ran retired code.",
            "**Ops kill switches**: large sites keep flags that turn off costly features, such as recommendations or search suggestions, during an incident."
          ],
          example: "`if (flags.enabled(\"new-checkout\", user))` guards the new path. The code ships Monday, off. Tuesday it is on for staff; Wednesday for 5% of users, with conversion watched against the old checkout. Thursday a payment bug appears and the flag goes off in seconds, no deploy. Friday's fix ships, the flag goes to 100%, and next sprint the old path and the flag are deleted.",
          nuance: "Every flag doubles the paths through the code, and old flags rot. Give each release flag an owner and an expiry, and delete it once fully rolled out.",
          read: [{ label: "Pete Hodgson: Feature Toggles (aka Feature Flags), the categories section", url: "https://martinfowler.com/articles/feature-toggles.html", m: 25 }],
          see: [{ label: "System design guide: feature flags", href: "SYSTEM%20DESIGN.html#/patterns/reliability/flags" }],
          tags: ["feature flags", "toggles", "launchdarkly", "rollout", "a/b"] }
      ] },
    { name: "Packaging and platforms", line: "What the code ships in, what runs it, and the config and secrets around it.",
      topics: [
        { id: "containers", name: "Containers and images",
          line: "An app and its dependencies in one image, run as an isolated process.",
          body: [
            "A container is an ordinary Linux process that the kernel isolates with **namespaces** (its own view of files, processes and network) and limits with **cgroups** (CPU and memory caps). It is not a virtual machine: all containers on a host share one kernel, which is why they start in milliseconds.",
            "An **image** is the container's filesystem, built from a `Dockerfile` as a stack of read-only, cached layers. Images are pushed to a **registry** (Docker Hub, GitHub Container Registry, Amazon ECR) under a tag and an immutable digest. The OCI standard means one image runs under Docker, containerd, Podman or Kubernetes."
          ],
          uses: [
            "**Docker**: made containers mainstream in 2013 with a simple build format and a public registry.",
            "**CI pipelines**: nearly every one now ends in an image pushed to a registry, which becomes the unit that is tested and deployed.",
            "**Cloud Run, Fargate, Kubernetes and Railway**: all take an OCI image as input, so one build runs on any of them."
          ],
          example: "Layer order decides build time. `COPY requirements.txt`, then `RUN pip install -r requirements.txt`, then `COPY . .`: a code change rebuilds only the last layer, in seconds. Put `COPY . .` first and every code change invalidates the install layer, so each build reinstalls every package, which can take minutes.",
          nuance: "A shared kernel is a weaker boundary than a VM, so untrusted code (user submissions, agent sandboxes) runs in gVisor, Firecracker microVMs or Kata containers. And pin images by digest: a tag such as `latest` can change under you.",
          read: [{ label: "Docker docs: Docker overview (images, containers, registries)", url: "https://docs.docker.com/get-started/docker-overview/", m: 12 }],
          tags: ["docker", "image", "registry", "namespaces", "cgroups", "oci"] },
        { id: "kubernetes", name: "Kubernetes",
          line: "A control loop that keeps the containers you declared running, healing and scaling them.",
          body: [
            "You tell Kubernetes the desired state in YAML; controllers compare it with the actual state and act to close the gap, forever. A **pod** is one or more containers scheduled together. A **deployment** keeps N identical pods running and replaces them gradually on a new version. A **service** gives a changing set of pods one stable address. An **ingress** or gateway routes outside HTTP traffic in.",
            "The **control plane** (API server, etcd, scheduler, controllers) decides; the **kubelet** on each node starts the pods. The Horizontal Pod Autoscaler checks metrics every 15 seconds by default and adjusts the replica count to a target."
          ],
          uses: [
            "**Google Borg**: the internal system Kubernetes grew out of; Google open-sourced Kubernetes in 2014.",
            "**EKS, GKE and AKS**: run the control plane as a managed service, so a team operates only the nodes and the workloads.",
            "**OpenAI research clusters**: OpenAI has written about scaling a single Kubernetes cluster to 7,500 nodes for model training."
          ],
          example: "A deployment says `replicas: 3`. A node dies, taking one pod with it. The ReplicaSet controller sees 2 running against 3 desired and creates a pod; the scheduler places it on a healthy node; that node's kubelet starts it; the service adds its IP once its readiness probe passes. Nobody was paged.",
          nuance: "Kubernetes is a platform for building platforms. It solves scheduling and healing, then hands you networking, storage, security policy, upgrades and a lot of YAML. Small teams usually do better on a managed container service.",
          read: [
            { label: "Kubernetes docs: overview, what it is and is not", url: "https://kubernetes.io/docs/concepts/overview/", m: 8 },
            { label: "Kubernetes docs: Horizontal Pod Autoscaling", url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/", m: 15 }
          ],
          tags: ["k8s", "pods", "deployment", "service", "hpa", "eks", "gke"] },
        { id: "infrastructure-as-code", name: "Infrastructure as code",
          line: "Networks, databases and clusters declared in reviewed files, not clicked together in a console.",
          body: [
            "Infrastructure as code describes cloud resources in files kept in git. With **Terraform** you write the resources you want in HCL; `terraform plan` compares them with a **state file** recording what exists and prints the changes; `terraform apply` makes them. Infrastructure then gets the same review, history and rollback as code, and a second environment is the same files with different variables.",
            "Alternatives: AWS CloudFormation and CDK (AWS only), Pulumi (general-purpose languages), and OpenTofu, a fork created after HashiCorp moved Terraform to a source-available licence in 2023."
          ],
          uses: [
            "**Terraform and OpenTofu**: manage most companies' AWS, GCP and Azure accounts, from VPCs to DNS records to IAM roles.",
            "**Disaster recovery plans**: assume a region can be rebuilt from the same code with a different region variable.",
            "**AWS CDK**: lets teams write infrastructure in TypeScript or Python, which it compiles to CloudFormation templates."
          ],
          example: "Add a bucket: write a `resource \"aws_s3_bucket\" \"uploads\"` block and open a pull request. CI posts the plan: `1 to add, 0 to change, 0 to destroy`. A reviewer approves and the merge runs `apply`. Months later someone edits the bucket's settings by hand in the console; the next plan shows a change to put them back, so the drift is visible instead of silent.",
          nuance: "The state file is the sharp edge. It must be stored remotely with locking so two applies cannot race, it can contain secrets, and any change made by hand in the console becomes drift that the next apply may silently undo.",
          read: [{ label: "HashiCorp: What is Terraform (write, plan, apply, state)", url: "https://developer.hashicorp.com/terraform/intro", m: 10 }],
          tags: ["terraform", "opentofu", "pulumi", "cloudformation", "state", "drift"] },
        { id: "config-and-secrets", name: "Configuration and secrets",
          line: "Settings that change per environment live outside the code; secrets live in a vault.",
          body: [
            "The Twelve-Factor rule: anything that differs between environments (database URLs, settings, API keys) comes from the environment, not the code, so one build runs in dev, staging and production. **Secrets** are the config an attacker wants: credentials, tokens, signing keys. They belong in a secrets manager (HashiCorp Vault, AWS Secrets Manager, Google Secret Manager, Doppler), fetched at runtime by a workload identity, with access logged and rotation automated.",
            "Better still are credentials that never exist as long-lived strings: cloud roles issue short-lived tokens, and CI systems can exchange an OIDC token for cloud credentials per run."
          ],
          uses: [
            "**External Secrets operator**: syncs values from AWS Secrets Manager or Vault into Kubernetes Secrets, so the source of truth stays outside the cluster.",
            "**SOPS**: encrypts the secret values inside YAML or JSON files with a cloud KMS key, so the files can live in git.",
            "**Vercel and Railway**: hold environment variables per environment and inject them at build and run time."
          ],
          example: "One image, three environments. The app reads `DATABASE_URL` at startup. In staging the platform sets it to the staging database; in production to the production one, fetched from Secrets Manager. When the database password rotates every 30 days, no code changes and no image is rebuilt: pods restart and read the new value.",
          nuance: "A Kubernetes Secret is base64-encoded, not encrypted, unless encryption at rest is configured for etcd. And environment variables leak into crash dumps, logs and child processes, so a secret in an env var still needs care.",
          read: [{ label: "The Twelve-Factor App: III, config", url: "https://12factor.net/config", m: 4 }],
          tags: ["secrets", "vault", "env vars", "oidc", "sops", "config"] }
      ] },
    { name: "Reliability", line: "Seeing what production does, deciding how reliable is enough, and responding when it breaks.",
      topics: [
        { id: "observability", name: "Logs, metrics, traces and OpenTelemetry",
          line: "Three kinds of telemetry that let you ask why a system misbehaves without shipping code.",
          body: [
            "**Logs** are timestamped records of events, best written as structured JSON with a request id. **Metrics** are numbers aggregated over time (requests per second, p99 latency, queue depth), cheap to store and good for alerts. **Traces** follow one request across services as a tree of **spans**, each with a start and a duration, which shows where the time went.",
            "**OpenTelemetry**, a CNCF project, is the vendor-neutral standard for producing all three: one SDK and wire format, sent to any backend. Google's SRE book names four golden signals to watch first: latency, traffic, errors and saturation."
          ],
          uses: [
            "**Prometheus and Grafana**: the open-source default for metrics and dashboards, scraping each service's `/metrics` endpoint.",
            "**Datadog, Honeycomb and Grafana Cloud**: hosted backends that accept OpenTelemetry data and link logs, metrics and traces.",
            "**Langfuse and LangSmith**: trace every model and tool call in LLM apps, with prompts, tokens and latency per span."
          ],
          example: "p99 checkout latency jumps from 300 ms to 2 s: that is the metric. Open a slow trace: the `checkout` span takes 2 s, and inside it `inventory.reserve` takes 1.8 s. Filter logs by that trace's request id: inventory logged `connection pool exhausted` 40 times. The metric said when, the trace said where, the log said why.",
          nuance: "Cost scales with cardinality: a metric labelled with user id creates one time series per user and can bill more than the service it watches. Put high-cardinality detail on traces and logs, and keep metric labels few.",
          read: [
            { label: "OpenTelemetry: observability primer", url: "https://opentelemetry.io/docs/concepts/observability-primer/", m: 10 },
            { label: "Google SRE book, ch. 6: Monitoring Distributed Systems (the four golden signals)", url: "https://sre.google/sre-book/monitoring-distributed-systems/", m: 25 }
          ],
          see: [{ label: "System design guide: monitoring", href: "SYSTEM%20DESIGN.html#/patterns/reliability/monitoring" }],
          tags: ["otel", "opentelemetry", "prometheus", "tracing", "logging", "golden signals"] },
        { id: "slos-error-budgets", name: "SLOs and error budgets",
          line: "A target for how reliable a service must be, and the failure that target allows.",
          body: [
            "An **SLI** is a measured ratio of good events, such as the share of requests answered successfully in under 300 ms. An **SLO** is the target for it over a window: 99.9% over 30 days. An **SLA** is a contract with a penalty, set looser than the SLO so you notice before you pay.",
            "The **error budget** is what the SLO leaves over. While budget remains, the team ships features and takes risks; when it runs out, the agreed policy shifts work to reliability until it recovers. That turns arguments between speed and stability into arithmetic."
          ],
          uses: [
            "**Google SRE**: introduced the practice, with policies that freeze launches for a service that has spent its budget.",
            "**Cloud provider SLAs**: AWS, Azure and Google publish per-service SLAs, often 99.9% or 99.99%, with service credits as the penalty.",
            "**Datadog, Grafana and Nobl9**: track SLOs and the remaining budget as first-class objects with their own dashboards."
          ],
          example: "99.9% over 30 days: 30 x 24 x 60 = 43,200 minutes, and 0.1% of that is about 43 minutes of full outage. A bad deploy that fails 10% of requests for 2 hours spends 12 minutes' worth, over a quarter of the month's budget. One more like it and launches pause until the window rolls forward.",
          nuance: "100% is the wrong target: users cannot tell 99.99% from 100% through their own flaky networks, and each extra nine costs far more. Pick the SLO from what users notice, measured as close to the user as you can.",
          read: [
            { label: "Google SRE book, ch. 4: Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/", m: 25 },
            { label: "Google SRE book, ch. 3: Embracing Risk (error budgets)", url: "https://sre.google/sre-book/embracing-risk/", m: 25 }
          ],
          tags: ["slo", "sli", "sla", "error budget", "nines"] },
        { id: "alerting", name: "Alerting",
          line: "Wake a human only for user-facing pain that needs action now; everything else is a ticket.",
          body: [
            "A good page is urgent, actionable and about a symptom users feel (errors, latency), not a cause (CPU at 90%). The modern way to alert on an SLO is by **burn rate**: how fast the error budget is being spent. A burn rate of 1 uses exactly the budget over the window.",
            "**Multiwindow** alerts require both a long window and a short one to exceed the threshold, so the alert fires fast on a real outage and clears fast after it ends. Slower burns open a ticket instead of a page."
          ],
          uses: [
            "**PagerDuty, Opsgenie and incident.io**: route a firing alert to whoever is on call, and escalate if nobody acknowledges.",
            "**Prometheus and Alertmanager**: Prometheus evaluates the alert rules; Alertmanager groups, silences and routes what fires.",
            "**Datadog monitors**: evaluate metric and SLO burn-rate conditions and notify Slack or a pager."
          ],
          example: "SLO 99.9% over 30 days. The SRE workbook pages when 2% of the budget burns in one hour: 0.02 x 720 hours gives a burn rate of 14.4, which means 1.44% of requests failing. Require both the last hour and the last 5 minutes above 14.4: a real outage pages within minutes, and the page clears soon after the fix instead of an hour later.",
          nuance: "Alert fatigue is the failure mode. When most pages need no action, people stop reading them and miss the real one. Delete or demote every alert that fired without needing a human.",
          read: [{ label: "Google SRE workbook: Alerting on SLOs (burn rates, multiwindow)", url: "https://sre.google/workbook/alerting-on-slos/", m: 30 }],
          tags: ["alerting", "burn rate", "pagerduty", "alertmanager", "paging"] },
        { id: "incident-response", name: "Incident response and postmortems",
          line: "Stop the bleeding first, coordinate with clear roles, then learn without blame.",
          body: [
            "An incident has one **incident commander** who holds the picture and decides, an **operations lead** who works the systems, and a **communications lead** who updates users, so the people fixing are not also writing status updates. The first goal is **mitigation**: roll back, fail over, shed load, turn off the flag. Root cause can wait until users are served again.",
            "Afterwards comes a **blameless postmortem**: a timeline, the contributing causes, what went well, and owned action items. Blameless means asking how the system let a reasonable person make the mistake, because people who fear blame hide the details you need."
          ],
          uses: [
            "**incident.io, Rootly and FireHydrant**: open a Slack channel per incident, assign roles and keep the timeline as people work.",
            "**Atlassian Statuspage**: carries the public updates, so customers read one source instead of opening tickets.",
            "**Cloudflare, AWS and GitHub postmortems**: published in detail, and some of the best free systems reading there is."
          ],
          example: "14:02 an error-rate alert pages. 14:04 the commander opens a channel and names an ops lead and a comms lead. 14:06 someone asks what changed: a deploy at 13:58. 14:09 it is rolled back and errors fall. 14:15 the status page says resolved. Two days later the postmortem finds the test that should have caught it never ran on that path, and adds it.",
          nuance: "Most incidents are triggered by a change: a deploy, a config push, a flag flip. The fastest first question is what changed in the last hour, and the fastest mitigation is often undoing it.",
          read: [
            { label: "Google SRE book, ch. 14: Managing Incidents", url: "https://sre.google/sre-book/managing-incidents/", m: 20 },
            { label: "Google SRE book, ch. 15: Postmortem Culture", url: "https://sre.google/sre-book/postmortem-culture/", m: 20 }
          ],
          tags: ["incident", "postmortem", "incident commander", "blameless", "rollback"] },
        { id: "on-call", name: "On-call",
          line: "A rotation that owns production after hours, sustainable only when pages are rare.",
          body: [
            "On-call engineers carry a pager for a shift, usually a week, with a primary and a secondary. They acknowledge pages within minutes, mitigate or escalate, and hand over open issues at the end. Runbooks for known alerts, dashboards linked from each alert, and the authority to roll back make a 3 a.m. page survivable.",
            "Google's SRE book sets limits: at most 25% of an engineer's time on call, and at most two incidents per 12-hour shift, since one incident with its follow-up takes about six hours."
          ],
          uses: [
            "**Product teams**: most now run on-call for their own services instead of handing them to a central operations team.",
            "**PagerDuty and incident.io**: manage rotations, escalation policies and overrides when someone swaps a shift.",
            "**Google SRE**: sizes a single-site team at about eight people to staff a primary and secondary rotation within those limits."
          ],
          example: "Why eight people. With one-week shifts, a primary and a secondary, each of eight engineers is primary one week and secondary one week in every eight. That is 2 weeks in 8, the 25% cap. With four people it is half their time, and the follow-up work from incidents never gets done.",
          nuance: "On-call load is a signal about the system, not the people. If a rotation is exhausting, the fix is fewer noisy alerts and fewer fragile services, paid for out of the error budget, not tougher engineers.",
          read: [{ label: "Google SRE book, ch. 11: Being On-Call", url: "https://sre.google/sre-book/being-on-call/", m: 20 }],
          tags: ["on-call", "pager", "rotation", "runbook", "toil"] }
      ] },
    { name: "Security", line: "The common ways apps are breached, and the habits that close them.",
      topics: [
        { id: "owasp-top-10", name: "OWASP Top 10",
          line: "The ranked list of the most common web application security failures.",
          body: [
            "The Open Worldwide Application Security Project publishes a ranked list of the most frequent and damaging classes of web vulnerability, built from data across many organisations. The 2025 edition leads with **broken access control** (a user reaching data or actions that are not theirs), then security misconfiguration, software supply chain failures, cryptographic failures and **injection**.",
            "Most entries have a standard defence: check authorisation on the server for every object, use parameterised queries, keep secure defaults, hash passwords with a slow function such as Argon2 or bcrypt."
          ],
          uses: [
            "**PCI DSS and security reviews**: reference the Top 10 as the baseline list of flaws an application must defend against.",
            "**Bug bounty programmes**: insecure direct object references, such as changing `/invoices/123` to `/124`, remain one of the most common findings.",
            "**OWASP Top 10 for LLM applications**: a separate list led by prompt injection, for apps that pass untrusted text to a model."
          ],
          example: "Broken access control in one query. `GET /api/invoices/124` runs `SELECT * FROM invoices WHERE id = 124` and returns the row to anyone logged in. The fix adds the owner: `WHERE id = $1 AND account_id = $2`, with the account taken from the session, never from the request. A scanner cannot find the first bug; it does not know who owns invoice 124.",
          nuance: "The list is a floor, not a standard. Passing a scanner does not cover access control bugs, which are logic errors only someone who knows the app's rules can find.",
          read: [{ label: "OWASP Top 10:2025: the category pages", url: "https://top10.owasp.org/2025", m: 30 }],
          see: [{ label: "System design guide: prompt injection", href: "SYSTEM%20DESIGN.html#/patterns/agent-safety/injection" }],
          tags: ["owasp", "injection", "access control", "xss", "idor"] },
        { id: "threat-modelling", name: "Threat modelling",
          line: "Asking, while designing, what an attacker could do and what you will do about it.",
          body: [
            "Threat modelling is structured worry done early. The Threat Modeling Manifesto reduces it to four questions: what are we working on, what can go wrong, what are we going to do about it, and did we do a good enough job. In practice you draw the system as a data-flow diagram, mark **trust boundaries** (where data crosses from outside into your control), and walk each one looking for threats.",
            "Microsoft's **STRIDE** gives the walk a checklist: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege."
          ],
          uses: [
            "**Design review at Microsoft and fintechs**: security teams require a threat model before a new service or data flow ships.",
            "**AI agents**: the key boundary is between untrusted text (web pages, emails, tool output) and the tools that act on it.",
            "**Microsoft Threat Modeling Tool**: a free tool that draws the data-flow diagram and suggests STRIDE threats for each element."
          ],
          example: "An upload feature. The boundary: a user's file enters your storage. Spoofing: can someone upload as another user? Check the session. Tampering: can they overwrite another user's file? Generate keys on the server. Information disclosure: can uploads be listed? Private bucket, presigned reads. Denial of service: a 50 GB file? A size limit in the upload policy. Four threats, four mitigations, one page.",
          nuance: "A threat model is worth most before code exists and least as a document nobody updates. Keep it to one diagram and one list, and redo it when a new trust boundary appears.",
          read: [{ label: "Threat Modeling Manifesto: values, principles and the four questions", url: "https://www.threatmodelingmanifesto.org/", m: 10 }],
          tags: ["threat model", "stride", "trust boundary", "design review"] },
        { id: "supply-chain", name: "Supply chain and dependencies",
          line: "Most of an app is other people's code; attackers aim at that code and the build.",
          body: [
            "A typical service pulls hundreds of open-source packages. Attacks target that chain: a known vulnerability in a library (**Log4Shell**, 2021), a malicious package that typosquats a popular name, a compromised maintainer, or a poisoned build system (**SolarWinds**, 2020, shipped a backdoor in a signed update). The **xz utils** backdoor (2024), planted over years by a trusted contributor, was caught because an engineer noticed SSH logins had slowed by about half a second.",
            "Defences: lockfiles and pinned versions, update tools (Dependabot, Renovate), an SBOM of what ships, and signed builds. **SLSA** defines levels of build integrity."
          ],
          uses: [
            "**npm and PyPI trusted publishing**: packages are published from a CI workflow's identity, with provenance attestations, instead of from a maintainer's long-lived token.",
            "**Sigstore cosign**: signs container images and records the signature in a public transparency log, so a cluster can refuse unsigned images.",
            "**US federal procurement**: asks software vendors for SBOMs, following a 2021 executive order on cybersecurity."
          ],
          example: "`package.json` asks for `\"left-pad\": \"^1.3.0\"`. Without a lockfile, tomorrow's install could pull a 1.4.0 published by someone who stole the maintainer's token. With `package-lock.json`, `npm ci` installs exactly 1.3.0 and checks its recorded integrity hash, so any changed byte fails the install. Upgrades arrive as Renovate pull requests that a person reviews.",
          nuance: "Most vulnerability alerts are for code paths you never call, and alert floods get ignored. Prioritise by reachability and exposure, and update often in small steps so the urgent patch is a small diff.",
          read: [{ label: "SLSA: the framework overview and levels", url: "https://slsa.dev/", m: 15 }],
          tags: ["supply chain", "sbom", "slsa", "dependabot", "log4shell", "xz"] },
        { id: "secrets-scanning", name: "Secrets scanning",
          line: "Catch API keys and passwords in code before they are pushed, and rotate any that leak.",
          body: [
            "Secret scanners look for strings that match known credential formats (AWS keys, Stripe keys, GitHub tokens, private keys) and for high-entropy strings in code, history and logs. Run them at three points: a pre-commit hook, a CI check, and continuous scanning of the repository and its history.",
            "GitHub's push protection blocks a push that contains a recognised token, and its partner programme tells providers when their tokens appear in public code so they can revoke them. When a secret leaks, the order is fixed: revoke and rotate, check the access logs, then clean up the code."
          ],
          uses: [
            "**GitHub secret scanning**: scans public repositories for partner token formats and alerts the provider that issued the token.",
            "**gitleaks and TruffleHog**: open-source scanners run as pre-commit hooks or CI steps; TruffleHog can also test whether a found key is still live.",
            "**Leaked cloud keys**: bots scrape public GitHub continuously, and stolen keys are often used to start crypto-mining instances within minutes."
          ],
          example: "A developer commits `.env` holding a live Stripe key. Push protection rejects the push and names the file and line. Had it gone through: roll the key in the Stripe dashboard first, check its request logs for calls you did not make, then remove the file and add `.env` to `.gitignore`. Rewriting history comes last, and it does not un-leak anything.",
          nuance: "Deleting the line does not remove the secret: it stays in git history, forks and caches. Treat any secret that reached a remote as compromised and rotate it.",
          read: [{ label: "GitHub docs: about secret scanning", url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning", m: 8 }],
          tags: ["secrets", "gitleaks", "trufflehog", "push protection", "rotation"] },
        { id: "zero-trust", name: "Zero trust",
          line: "No request is trusted for being inside the network; every one proves identity and authorisation.",
          body: [
            "The old model was a castle: a firewall at the edge, a VPN to get in, and broad trust for anything inside. Zero trust drops the inside. Every request, from a person or a service, is authenticated and authorised on its own, using the user's identity, the device's health and the context. Access is granted per application, not per network, and kept to the minimum.",
            "For services, this means **mutual TLS** between them (often through a service mesh such as Istio or Linkerd) and workload identities such as SPIFFE. For people, an identity-aware proxy replaces the VPN."
          ],
          uses: [
            "**Google BeyondCorp**: built after the 2009 Operation Aurora attacks, it moved Google's staff off a privileged corporate network onto per-request checks.",
            "**Cloudflare Access, Zscaler and Tailscale**: sell identity-aware access to internal apps as a VPN replacement.",
            "**NIST SP 800-207**: the 2020 publication that defines zero trust architecture for US federal agencies."
          ],
          example: "An engineer opens the internal admin dashboard from a cafe. There is no VPN: the request hits an identity-aware proxy, which checks a fresh SSO login, that the laptop is a managed device with disk encryption on, and that the engineer's group may use this app. The dashboard then calls the billing service over mutual TLS, and billing checks the dashboard's workload identity before it answers.",
          nuance: "Zero trust is an architecture, not a product you buy. A tool that replaces the VPN while every service still trusts every caller on the internal network has changed the front door only.",
          read: [{ label: "NIST SP 800-207: Zero Trust Architecture", url: "https://csrc.nist.gov/pubs/sp/800/207/final", m: 15 }],
          tags: ["zero trust", "beyondcorp", "mtls", "service mesh", "vpn"] }
      ] }
  ],
  see: [
    { label: "System design guide: reliability patterns", href: "SYSTEM%20DESIGN.html#/patterns/reliability/monitoring" },
    { label: "Cloud computing", href: "BASELINE.html#/cloud" }
  ]
});

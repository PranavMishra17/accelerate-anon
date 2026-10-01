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
            "Git records every change as a commit in a history anyone can branch from and merge back into. How a team branches is the real decision. **Trunk-based development** keeps one main branch (the trunk); people work on short-lived branches, a day or two at most, reviewed and merged often, so the trunk is always close to releasable. Unfinished features hide behind feature flags rather than living on a long branch.",
            "The alternative, long-lived feature branches merged near a release, produces large merges full of conflicts and integration bugs found late. DORA's research across thousands of teams links trunk-based work with higher deployment frequency and lower change failure rates."
          ],
          where: "Google and Meta run monorepos where thousands of engineers commit to one trunk. GitHub flow (branch, pull request, merge to main) is the common small-team form. DORA's five delivery metrics (lead time, deploy frequency, recovery time, change fail rate, rework rate) measure the result.",
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
            "A pipeline is a series of stages defined as code next to the app: lint and type-check, unit tests, build a container image, scan it for vulnerabilities, run integration tests against real dependencies, deploy to staging, then to production. Fast feedback is the point: a pipeline that takes an hour gets skipped or batched, and batching is what CI exists to prevent."
          ],
          where: "GitHub Actions, GitLab CI, Buildkite and CircleCI run most pipelines. Large companies deploy each service many times a day.",
          nuance: "A flaky test is worse than no test: people learn to re-run until green, and then ignore real failures. Quarantine or fix flaky tests at once, and keep the critical path short enough to wait for.",
          read: [{ label: "Martin Fowler: Continuous Integration (2024 revision)", url: "https://martinfowler.com/articles/continuousIntegration.html", m: 35 }],
          tags: ["ci", "cd", "github actions", "pipeline", "build"] },
        { id: "deployment-strategies", name: "Deployment strategies",
          line: "Rolling, blue-green and canary: ways to release so a bad version hurts few users.",
          body: [
            "A **rolling** deployment replaces instances a few at a time; it is Kubernetes' default. **Blue-green** runs two full environments: deploy to the idle one, test it, switch traffic over, and switch back to roll back in seconds. A **canary** release sends a small share of traffic (1%, then 10%, then all) to the new version while comparing its error rate and latency with the old, and stops automatically if they worsen.",
            "All three rely on the old version staying runnable, which means database migrations must be backward compatible: add a column, deploy code that uses it, and drop the old one in a later release (expand, then contract)."
          ],
          where: "Argo Rollouts and Flagger automate canaries on Kubernetes; AWS CodeDeploy does blue-green. In July 2024 a CrowdStrike content update, pushed to every machine at once rather than staged, crashed about 8.5 million Windows computers.",
          nuance: "Staging rarely matches production's data, traffic and scale, so the canary is often the first real test. Treat configuration and content pushes as deploys too: they cause as many outages as code.",
          read: [
            { label: "Martin Fowler: BlueGreenDeployment", url: "https://martinfowler.com/bliki/BlueGreenDeployment.html", m: 4 },
            { label: "Danilo Sato: CanaryRelease", url: "https://martinfowler.com/bliki/CanaryRelease.html", m: 6 }
          ],
          tags: ["canary", "blue-green", "rolling", "rollback", "migration"] },
        { id: "feature-flags", name: "Feature flags",
          line: "Ship code turned off, then turn it on for chosen users without a deploy.",
          body: [
            "A feature flag is a runtime switch around a code path, read from a flag service or config. It separates **deploy** (the code is in production) from **release** (users see it). Common kinds: **release** flags hide unfinished work on the trunk, **experiment** flags split users for A/B tests, **ops** flags let on-call turn off an expensive feature under load, and **permission** flags gate features to beta users or paying plans.",
            "Flags enable gradual rollout by user rather than by server: internal staff first, then 5% of users, then everyone, with an instant off switch that needs no rollback."
          ],
          where: "LaunchDarkly, Statsig, Unleash and Optimizely sell flag services; large companies build their own. In 2012 Knight Capital lost more than $400 million in under an hour when an old flag was reused and one server still ran retired code.",
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
            "An **image** is the container's filesystem, built from a `Dockerfile` as a stack of read-only layers; unchanged layers are cached and shared, so ordering steps well makes builds fast. Images are pushed to a **registry** (Docker Hub, GitHub Container Registry, Amazon ECR) under a tag and an immutable digest, and pulled by any machine that runs them. The OCI standard means images built by Docker run under containerd, Podman or Kubernetes alike."
          ],
          where: "Docker (2013) made containers mainstream. Nearly every CI pipeline now ends in an image, and Cloud Run, Fargate, Kubernetes and Railway all run images.",
          nuance: "A shared kernel is a weaker boundary than a VM, so untrusted code (user submissions, agent sandboxes) runs in gVisor, Firecracker microVMs or Kata containers. And pin images by digest: a tag such as `latest` can change under you.",
          read: [{ label: "Docker docs: Docker overview (images, containers, registries)", url: "https://docs.docker.com/get-started/docker-overview/", m: 12 }],
          tags: ["docker", "image", "registry", "namespaces", "cgroups", "oci"] },
        { id: "kubernetes", name: "Kubernetes",
          line: "A control loop that keeps the containers you declared running, healing and scaling them.",
          body: [
            "You tell Kubernetes the desired state in YAML; controllers compare it with the actual state and act to close the gap, forever. A **pod** is one or more containers scheduled together on a node. A **deployment** keeps N identical pods running and replaces them gradually on a new version. A **service** gives a changing set of pods one stable address and load-balances across them. An **ingress** or gateway routes outside HTTP traffic in.",
            "The **control plane** (API server, etcd store, scheduler, controllers) decides; the **kubelet** on each node starts the pods. The Horizontal Pod Autoscaler checks metrics every 15 seconds by default and changes the replica count to hold a target such as 60% CPU."
          ],
          where: "Kubernetes came out of Google's internal Borg system and was open-sourced in 2014. EKS, GKE and AKS run it as a service. OpenAI has written about running clusters of 7,500 nodes for research.",
          nuance: "Kubernetes is a platform for building platforms. It solves scheduling and healing, then hands you networking, storage, security policy, upgrades and a lot of YAML. Small teams usually do better on a managed container service.",
          read: [
            { label: "Kubernetes docs: overview, what it is and is not", url: "https://kubernetes.io/docs/concepts/overview/", m: 8 },
            { label: "Kubernetes docs: Horizontal Pod Autoscaling", url: "https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/", m: 15 }
          ],
          tags: ["k8s", "pods", "deployment", "service", "hpa", "eks", "gke"] },
        { id: "infrastructure-as-code", name: "Infrastructure as code",
          line: "Networks, databases and clusters declared in reviewed files, not clicked together in a console.",
          body: [
            "Infrastructure as code describes cloud resources in files kept in git. With **Terraform**, you write the resources you want in HCL; `terraform plan` compares them with a **state file** recording what exists and prints the changes; `terraform apply` makes them. Infrastructure then gets the same review, history and rollback as application code, and a second environment is a copy of the same files with different variables.",
            "Alternatives differ in language and scope: AWS CloudFormation and CDK (AWS only), Pulumi (general-purpose languages), and OpenTofu, an open-source fork created after HashiCorp moved Terraform to a source-available licence in 2023."
          ],
          where: "Most companies on AWS, GCP or Azure manage their accounts with Terraform or OpenTofu. Disaster recovery plans assume infrastructure can be rebuilt from code in another region.",
          nuance: "The state file is the sharp edge. It must be stored remotely with locking so two applies cannot race, it can contain secrets, and any change made by hand in the console becomes drift that the next apply may silently undo.",
          read: [{ label: "HashiCorp: What is Terraform (write, plan, apply, state)", url: "https://developer.hashicorp.com/terraform/intro", m: 10 }],
          tags: ["terraform", "opentofu", "pulumi", "cloudformation", "state", "drift"] },
        { id: "config-and-secrets", name: "Configuration and secrets",
          line: "Settings that change per environment live outside the code; secrets live in a vault.",
          body: [
            "The Twelve-Factor rule: anything that differs between environments (database URLs, feature settings, API keys) comes from the environment, not from the code, so one build runs in dev, staging and production. **Secrets** are the config an attacker wants: credentials, tokens, signing keys. They belong in a secrets manager (HashiCorp Vault, AWS Secrets Manager, Google Secret Manager, Doppler), fetched at runtime by a workload identity, with access logged and rotation automated.",
            "Better still are credentials that never exist as long-lived strings: cloud roles issue short-lived tokens, and CI systems such as GitHub Actions can exchange an OIDC token for cloud credentials per run."
          ],
          where: "Kubernetes Secrets, the External Secrets operator, SOPS-encrypted files in git, and Vercel or Railway environment variables are common homes. Leaked keys in public repos are found by scanners within minutes.",
          nuance: "A Kubernetes Secret is base64-encoded, not encrypted, unless encryption at rest is configured for etcd. And environment variables leak into crash dumps, logs and child processes, so a secret in an env var still needs care.",
          read: [{ label: "The Twelve-Factor App: III, config", url: "https://12factor.net/config", m: 4 }],
          tags: ["secrets", "vault", "env vars", "oidc", "sops", "config"] }
      ] },
    { name: "Reliability", line: "Seeing what production does, deciding how reliable is enough, and responding when it breaks.",
      topics: [
        { id: "observability", name: "Logs, metrics, traces and OpenTelemetry",
          line: "Three kinds of telemetry that let you ask why a system misbehaves without shipping code.",
          body: [
            "**Logs** are timestamped records of events, best written as structured JSON with a request id. **Metrics** are numbers aggregated over time (requests per second, p99 latency, queue depth), cheap to store and good for dashboards and alerts. **Traces** follow one request across services as a tree of **spans**, each with a start, a duration and attributes, which shows where the time went.",
            "**OpenTelemetry** is the vendor-neutral standard (a CNCF project formed from OpenTracing and OpenCensus) for producing all three: one SDK and wire format, sent to any backend. Google's SRE book names four golden signals to watch first: latency, traffic, errors and saturation."
          ],
          where: "Prometheus and Grafana are the open-source default for metrics; Datadog, Honeycomb, Grafana Cloud and New Relic sell hosted backends. LLM apps add traces of every model and tool call through Langfuse, LangSmith or Braintrust.",
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
            "The **error budget** is what the SLO leaves over: 99.9% over 30 days allows about 43 minutes of full outage, or the equivalent in failed requests. While budget remains, the team ships features and takes risks; when it runs out, the agreed policy shifts work to reliability until it recovers. That turns arguments between speed and stability into arithmetic."
          ],
          where: "Google SRE introduced the practice; most large engineering organisations now run SLOs, with tooling in Datadog, Grafana, Nobl9 and Google Cloud. Cloud providers publish SLAs per service (often 99.9% or 99.99%) with credits as the penalty.",
          nuance: "100% is the wrong target: users cannot tell 99.99% from 100% through their own flaky networks, and each extra nine costs far more. Pick the SLO from what users notice, measured as close to the user as you can.",
          read: [
            { label: "Google SRE book, ch. 4: Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/", m: 25 },
            { label: "Google SRE book, ch. 3: Embracing Risk (error budgets)", url: "https://sre.google/sre-book/embracing-risk/", m: 25 }
          ],
          tags: ["slo", "sli", "sla", "error budget", "nines"] },
        { id: "alerting", name: "Alerting",
          line: "Wake a human only for user-facing pain that needs action now; everything else is a ticket.",
          body: [
            "A good page is urgent, actionable and about a symptom users feel (errors, latency), not a cause (CPU at 90%). The modern way to alert on an SLO is by **burn rate**: how fast the error budget is being spent. A burn rate of 1 uses exactly the budget over the window; the SRE workbook suggests paging when 2% of a 30-day budget is spent in one hour, a burn rate of 14.4.",
            "**Multiwindow** alerts require both a long window and a short one to exceed the threshold, so the alert fires fast on a real outage and clears fast after it ends. Slower burns open a ticket instead of a page."
          ],
          where: "PagerDuty, Opsgenie, incident.io and Grafana OnCall route alerts to whoever is on call. Prometheus Alertmanager and Datadog monitors evaluate the rules.",
          nuance: "Alert fatigue is the failure mode. When most pages need no action, people stop reading them and miss the real one. Delete or demote every alert that fired without needing a human.",
          read: [{ label: "Google SRE workbook: Alerting on SLOs (burn rates, multiwindow)", url: "https://sre.google/workbook/alerting-on-slos/", m: 30 }],
          tags: ["alerting", "burn rate", "pagerduty", "alertmanager", "paging"] },
        { id: "incident-response", name: "Incident response and postmortems",
          line: "Stop the bleeding first, coordinate with clear roles, then learn without blame.",
          body: [
            "An incident has one **incident commander** who holds the overall picture and makes decisions, an **operations lead** who works the systems, and a **communications lead** who updates users and stakeholders, so the people fixing are not also writing status updates. The first goal is **mitigation**: roll back, fail over, shed load, turn off the flag. Root cause can wait until users are served again.",
            "Afterwards comes a **blameless postmortem**: a written timeline, the contributing causes, what went well, and owned action items. Blameless means it asks how the system let a reasonable person make the mistake, because people who fear blame hide the details you need."
          ],
          where: "incident.io, Rootly and FireHydrant run incidents in Slack; Statuspage and its peers carry the public updates. Cloudflare, AWS and GitHub publish detailed postmortems that are some of the best free systems reading available.",
          nuance: "Most incidents are triggered by a change: a deploy, a config push, a flag flip. The fastest first question is what changed in the last hour, and the fastest mitigation is often undoing it.",
          read: [
            { label: "Google SRE book, ch. 14: Managing Incidents", url: "https://sre.google/sre-book/managing-incidents/", m: 20 },
            { label: "Google SRE book, ch. 15: Postmortem Culture", url: "https://sre.google/sre-book/postmortem-culture/", m: 20 }
          ],
          tags: ["incident", "postmortem", "incident commander", "blameless", "rollback"] },
        { id: "on-call", name: "On-call",
          line: "A rotation that owns production after hours, sustainable only when pages are rare.",
          body: [
            "On-call engineers carry a pager for a shift, usually a week, with a primary and a secondary. They acknowledge pages within minutes, mitigate or escalate, and hand over open issues at the end of the shift. Runbooks for known alerts, dashboards linked from each alert, and the authority to roll back are what make a 3 a.m. page survivable.",
            "Google's SRE book sets sustainable limits: at most 25% of an engineer's time on call, and at most two incidents per 12-hour shift, since one incident with its follow-up takes about six hours. A single-site team needs about eight people to staff a primary and secondary rotation inside those limits."
          ],
          where: "Most product teams now run their own on-call rather than handing services to a central operations team. PagerDuty and incident.io manage rotations, escalation and overrides.",
          nuance: "On-call load is a signal about the system, not the people. If a rotation is exhausting, the fix is fewer noisy alerts and fewer fragile services, paid for out of the error budget, not tougher engineers.",
          read: [{ label: "Google SRE book, ch. 11: Being On-Call", url: "https://sre.google/sre-book/being-on-call/", m: 20 }],
          tags: ["on-call", "pager", "rotation", "runbook", "toil"] }
      ] },
    { name: "Security", line: "The common ways apps are breached, and the habits that close them.",
      topics: [
        { id: "owasp-top-10", name: "OWASP Top 10",
          line: "The ranked list of the most common web application security failures.",
          body: [
            "The Open Worldwide Application Security Project publishes a list of the most frequent and damaging classes of web vulnerability, built from data across many organisations. The 2025 edition leads with **broken access control** (a user reaching data or actions that are not theirs), then security misconfiguration, then software supply chain failures, cryptographic failures and **injection** (SQL, command and template injection). It ends with insecure design, authentication failures, integrity failures, logging and alerting failures, and mishandling of exceptional conditions.",
            "Most entries have a standard defence: check authorisation on the server for every object, use parameterised queries, keep secure defaults, hash passwords with a slow function such as Argon2 or bcrypt."
          ],
          where: "PCI DSS and many security reviews reference the Top 10. Insecure direct object references (changing `/invoices/123` to `/124`) remain one of the most common bug-bounty findings. LLM apps add prompt injection, which OWASP tracks in a separate Top 10 for LLM applications.",
          nuance: "The list is a floor, not a standard. Passing a scanner does not cover access control bugs, which are logic errors only someone who knows the app's rules can find.",
          read: [{ label: "OWASP Top 10:2025: the category pages", url: "https://top10.owasp.org/2025", m: 30 }],
          see: [{ label: "System design guide: prompt injection", href: "SYSTEM%20DESIGN.html#/patterns/agent-safety/injection" }],
          tags: ["owasp", "injection", "access control", "xss", "idor"] },
        { id: "threat-modelling", name: "Threat modelling",
          line: "Asking, while designing, what an attacker could do and what you will do about it.",
          body: [
            "Threat modelling is structured worry done early. The Threat Modeling Manifesto reduces it to four questions: what are we working on, what can go wrong, what are we going to do about it, and did we do a good enough job. In practice you draw the system as a data-flow diagram, mark **trust boundaries** (where data crosses from the internet, a user or a third party into your control), and walk each boundary looking for threats.",
            "Microsoft's **STRIDE** gives the walk a checklist: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege. Each threat gets a mitigation, an accepted risk, or a ticket."
          ],
          where: "Security teams at Microsoft, Google and most fintechs require a threat model in design review. For AI agents the key boundary is between untrusted text (web pages, emails, tool output) and the tools that act on it.",
          nuance: "A threat model is worth most before code exists and least as a document nobody updates. Keep it to one diagram and one list, and redo it when a new trust boundary appears.",
          read: [{ label: "Threat Modeling Manifesto: values, principles and the four questions", url: "https://www.threatmodelingmanifesto.org/", m: 10 }],
          tags: ["threat model", "stride", "trust boundary", "design review"] },
        { id: "supply-chain", name: "Supply chain and dependencies",
          line: "Most of an app is other people's code; attackers aim at that code and the build.",
          body: [
            "A typical service pulls hundreds of open-source packages, each with its own maintainers and dependencies. Attacks target that chain: a known vulnerability in a library (**Log4Shell**, 2021), a malicious package that typosquats a popular name, a compromised maintainer, or a poisoned build system (**SolarWinds**, 2020, shipped a backdoor in a signed update). The **xz utils** backdoor (2024), planted over years by a trusted contributor, was caught because an engineer noticed SSH logins had slowed by about half a second.",
            "Defences: lockfiles and pinned versions, automated update and vulnerability tools (Dependabot, Renovate, `npm audit`), an SBOM listing what ships, and signed, reproducible builds. **SLSA** defines levels of build integrity."
          ],
          where: "npm and PyPI now support trusted publishing and provenance attestations. Sigstore's cosign signs container images. US federal software procurement asks vendors for SBOMs.",
          nuance: "Most vulnerability alerts are for code paths you never call, and alert floods get ignored. Prioritise by reachability and exposure, and update often in small steps so the urgent patch is a small diff.",
          read: [{ label: "SLSA: the framework overview and levels", url: "https://slsa.dev/", m: 15 }],
          tags: ["supply chain", "sbom", "slsa", "dependabot", "log4shell", "xz"] },
        { id: "secrets-scanning", name: "Secrets scanning",
          line: "Catch API keys and passwords in code before they are pushed, and rotate any that leak.",
          body: [
            "Secret scanners look for strings that match known credential formats (AWS keys, Stripe keys, GitHub tokens, private keys) and for high-entropy strings in code, history, logs and tickets. Run them at three points: a pre-commit hook on the developer's machine, a check in CI, and continuous scanning of the whole repository and its history. GitHub's push protection blocks a push that contains a recognised token, and its partner programme tells providers when their tokens appear in public code so they can revoke them.",
            "When a secret leaks, the response order is fixed: revoke and rotate it, check the access logs for use, then clean up the code."
          ],
          where: "GitHub secret scanning, GitGuardian, gitleaks and TruffleHog are the common tools. Bots scrape public GitHub continuously, and leaked cloud keys are often used to start crypto-mining instances within minutes.",
          nuance: "Deleting the line does not remove the secret: it stays in git history, forks and caches. Treat any secret that reached a remote as compromised and rotate it.",
          read: [{ label: "GitHub docs: about secret scanning", url: "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning", m: 8 }],
          tags: ["secrets", "gitleaks", "trufflehog", "push protection", "rotation"] },
        { id: "zero-trust", name: "Zero trust",
          line: "No request is trusted for being inside the network; every one proves identity and authorisation.",
          body: [
            "The old model was a castle: a firewall at the edge, a VPN to get in, and broad trust for anything inside. Zero trust drops the inside. Every request, from a person or a service, is authenticated and authorised on its own, using the identity of the user, the health of the device and the context, wherever it comes from. Access is granted per application, not per network, and kept to the minimum.",
            "For services, this means **mutual TLS** between them (often through a service mesh such as Istio or Linkerd) and workload identities such as SPIFFE. For people, an identity-aware proxy replaces the VPN."
          ],
          where: "Google built BeyondCorp after the 2009 Operation Aurora attacks and moved its staff off a privileged corporate network. Cloudflare Access, Zscaler, Tailscale and Google's IAP sell the model; NIST SP 800-207 (2020) defines it for US agencies.",
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

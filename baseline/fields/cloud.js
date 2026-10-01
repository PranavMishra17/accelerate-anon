BASELINE.field({
  id: "cloud", name: "Cloud computing", short: "Cloud", layer: "Building",
  ink: "#2F6E8C", inkDark: "#8EC6DF",
  lede: "Renting compute, storage and network from someone else's data centres by the second, through an API, instead of buying and racking machines.",
  overview: [
    "The cloud is other people's computers, sold as metered services you create and destroy with an API call. A team that once waited weeks for a server now gets a virtual machine in a minute, a Postgres database with backups and failover in ten, and a GPU when the provider has one to spare. The people who work on it are cloud engineers, platform engineers and solutions architects: they choose the services, draw the network, set who may touch what, and watch the bill. Much of the job is trade-offs between control, cost and how much of the stack you want to own.",
    "Cloud sits under almost every other field here. The backend runs on its machines and managed databases, DevOps automates it, distributed systems theory explains its failure modes, and inference lives or dies on its GPU supply. The market in 2026 is AWS, then Microsoft Azure, then Google Cloud, with Oracle and GPU-focused providers such as CoreWeave growing on AI demand. Above them sits a layer of developer platforms (Vercel, Supabase, Cloudflare, Railway, Modal) that hide most of the console behind a git push.",
    "Read the map as one request travelling from a domain name to a stored byte. The clusters follow the same order: what the cloud is, what it rents you, how the pieces connect, and how to keep it secure, affordable and alive when a region goes down."
  ],
  diagram: {
    nodes: [
      { id: "dns", label: "DNS", sub: "name to an address", col: 0, row: 0 },
      { id: "cdn", label: "CDN edge", sub: "cached near the user", col: 0, row: 1 },
      { id: "load-balancers", label: "Load balancer", sub: "spreads across zones", col: 0, row: 2 },
      { id: "vpc", label: "VPC and subnets", sub: "your private network", col: 1, row: 0 },
      { id: "virtual-machines", label: "Virtual machines", sub: "rented servers", col: 1, row: 1 },
      { id: "containers", label: "Containers", sub: "packaged services", col: 1, row: 2 },
      { id: "serverless", label: "Functions", sub: "code per request", col: 1, row: 3 },
      { id: "iam", label: "IAM", sub: "who may call what", col: 2, row: 0 },
      { id: "managed-databases", label: "Managed database", sub: "Postgres someone runs", col: 2, row: 1 },
      { id: "storage", label: "Object storage", sub: "S3 and its kin", col: 2, row: 2 },
      { id: "regions-zones", label: "Regions and zones", sub: "where it all sits", col: 2, row: 3 }
    ],
    edges: [
      ["dns", "cdn", "resolves to"], ["cdn", "load-balancers", "on a miss"],
      ["load-balancers", "virtual-machines"], ["load-balancers", "containers"],
      ["vpc", "virtual-machines", "contains"], ["virtual-machines", "managed-databases"],
      ["containers", "storage"], ["serverless", "storage"], ["containers", "serverless"],
      ["iam", "managed-databases", "grants access"], ["storage", "regions-zones", "copied across"]
    ],
    cap: "**One request's path through a cloud deployment, from a name to a stored byte.** DNS points at an edge cache; a miss goes to a load balancer, which picks a healthy machine or container inside your private network. Those read and write managed databases and object storage, IAM decides which of them may, and all of it is placed in regions and zones. Click a box to open it."
  },
  start: [
    { label: "Learn to Cloud: the curriculum page, then phase 4 (cloud platform fundamentals)", url: "https://learntocloud.guide/curriculum", m: 45,
      why: "A free, ordered path from Linux and networking to a deployed app on AWS, Azure or GCP, with projects at each phase." },
    { label: "NIST SP 800-145: The NIST Definition of Cloud Computing", url: "https://csrc.nist.gov/pubs/sp/800/145/final", m: 10,
      why: "Two pages that fix the vocabulary: five characteristics, three service models, four deployment models." },
    { label: "Google Cloud: AWS, Azure and Google Cloud service comparison", url: "https://docs.cloud.google.com/docs/get-started/aws-azure-gcp-service-comparison", m: 15,
      why: "One table that translates every product name across the big three, so S3, Blob Storage and Cloud Storage read as one idea." }
  ],
  clusters: [
    { name: "What the cloud is", line: "The rental model, where the machines sit, and who sells them.",
      topics: [
        { id: "what-is-cloud", name: "What the cloud is",
          line: "Compute, storage and network rented on demand, metered, and created through an API.",
          body: [
            "A cloud provider runs huge data centres and slices them into services you rent: virtual machines, disks, databases, queues, networks. You ask for them through an API or console, pay by the second, hour or gigabyte, and give them back when done. The NIST definition (2011) names five traits: on-demand self-service, broad network access, pooled resources, rapid elasticity and measured service.",
            "The shift is from capital spending to operating spending: instead of buying servers sized for peak load three years out, you pay for what runs today. The provider carries the hardware, power and cooling; you carry the design and the bill."
          ],
          uses: [
            "**Netflix on AWS**: moved its streaming backend to AWS after a 2008 database corruption stalled DVD shipping, and finished the move in 2016.",
            "**A new startup**: usually never owns a server; an API call replaces the purchase order, the rack and the weeks of waiting.",
            "**Banks, governments and AI labs**: run on the same public clouds, often alongside their own data centres in a hybrid setup."
          ],
          example: "A team launches a product that might get 100 users or 100,000. On premises they buy, say, 20 servers up front and wait weeks for them. In the cloud they start two VMs in a minute, add 30 more when a launch post spreads, and delete them the next week, paying only for the hours each one ran.",
          nuance: "The cloud is not automatically cheaper. It is cheaper to start and to scale up quickly; at steady, large, predictable load, owning hardware can cost less, which is why some companies move workloads back. You pay for flexibility.",
          read: [{ label: "NIST SP 800-145: the definition and its five characteristics", url: "https://csrc.nist.gov/pubs/sp/800/145/final", m: 10 }],
          tags: ["iaas", "elasticity", "capex", "opex"] },
        { id: "regions-zones", name: "Regions and availability zones",
          line: "A region is a city-sized area; zones are separate data centres inside it.",
          body: [
            "A **region** (AWS `us-east-1`, Google `europe-west4`) is a geographic area with its own independent copy of the provider's services. Inside it are **availability zones**: groups of data centres with separate power, cooling and network, a few milliseconds apart at most, but far enough apart that a fire or flood takes out one, not all.",
            "You pick a region for latency to users, for data residency law, and for which services and GPUs it offers. You spread across zones for availability. Regions are isolated by design, so going multi-region is a separate, much larger decision."
          ],
          uses: [
            "**AWS us-east-1**: the oldest and largest region, in Northern Virginia; its outages in December 2021 and October 2025 took down services far beyond AWS.",
            "**EU companies under GDPR**: pin personal data to regions such as Frankfurt or Ireland so it stays inside the EU.",
            "**GPU workloads**: often have to go where the capacity is, since the newest accelerators exist in only some regions."
          ],
          example: "Run three app instances, one in each of zones `a`, `b` and `c` of a region, behind one load balancer, with a database standby in a second zone. When zone `a` loses power, the balancer's health checks fail for that instance within seconds and traffic moves to the other two. The service stays up at two-thirds capacity while autoscaling replaces the lost instance.",
          nuance: "Multi-AZ is cheap insurance and should be the default; multi-region is expensive and rarely needed. Traffic between zones is billed, so a chatty service split across zones pays for every cross-zone call.",
          read: [
            { label: "AWS EC2 docs: Regions and Zones", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html", m: 8 },
            { label: "AWS Builders' Library: Static stability using Availability Zones", url: "https://aws.amazon.com/builders-library/static-stability-using-availability-zones/", m: 20 }
          ],
          tags: ["az", "region", "us-east-1", "residency"] },
        { id: "service-models", name: "IaaS, PaaS, serverless and SaaS",
          line: "How much of the stack you rent, from bare virtual machines to finished software.",
          body: [
            "The models differ in where the provider's responsibility stops. **IaaS** (EC2, Compute Engine) rents virtual machines and networks; you manage the operating system up. **PaaS** (Heroku, App Engine) takes your code and runs it. **Serverless** (Lambda, Cloud Run) adds scale to zero and per-request billing. **SaaS** (Gmail, Salesforce, Slack) is finished software you log in to.",
            "Moving up the stack trades control for less operations work. Most real systems mix them: containers on a managed platform, a managed database, a SaaS for email and payments."
          ],
          uses: [
            "**Heroku**: defined PaaS around 2010 with `git push heroku main`; Vercel and Railway are its modern heirs.",
            "**AWS Lambda**: launched in 2014 and started the serverless wave, running code per event with no server to size.",
            "**Stripe, Twilio and Auth0**: SaaS that developers wire into their own apps for payments, messaging and login instead of building them."
          ],
          example: "Patching a vulnerable OpenSSL, by model. On EC2 (IaaS) you rebuild the image and replace every VM yourself. On App Engine (PaaS) the provider patches the runtime, but your app's own libraries are still yours. On Lambda's managed runtimes the provider patches under you. On Slack (SaaS) you do nothing; the vendor's fix reaches you.",
          nuance: "The security split moves with the model. On IaaS, patching the operating system is yours; on serverless it is the provider's. Read the shared responsibility model for each service you use, because a breach in your half is still your breach.",
          read: [{ label: "AWS: the shared responsibility model", url: "https://aws.amazon.com/compliance/shared-responsibility-model/", m: 6 }],
          tags: ["iaas", "paas", "saas", "faas", "shared responsibility"] },
        { id: "big-three", name: "AWS, Azure and Google Cloud",
          line: "Three providers with the same building blocks under different names and strengths.",
          body: [
            "The big three sell the same primitives (VMs, object storage, managed databases, Kubernetes, functions, queues) under different names. **AWS** launched first (S3 and EC2 in 2006) and has the widest catalogue and largest share. **Azure** wins where companies already run Microsoft: Active Directory, Office, .NET, and OpenAI's models. **Google Cloud** is strongest in data and AI: BigQuery, its own TPU chips, and the network it built for search.",
            "Behind them, Oracle Cloud has grown on large AI training contracts, and GPU-focused providers such as CoreWeave, Lambda and Nebius rent accelerators with less of the surrounding catalogue."
          ],
          uses: [
            "**Netflix and Airbnb**: grew up on AWS and run most of their infrastructure there.",
            "**OpenAI on Azure**: trained its GPT models on Microsoft-built supercomputers, and Azure resells the models as a service.",
            "**Spotify on Google Cloud**: moved off its own data centres to Google Cloud from 2016, with BigQuery and Dataflow at the centre of its data work.",
            "**Large enterprises**: usually run on two or more providers, often by acquisition rather than plan."
          ],
          example: "One idea, three names. Object storage is S3, Azure Blob Storage and Google Cloud Storage. Managed Kubernetes is EKS, AKS and GKE. A function is Lambda, Azure Functions or Cloud Run functions. Identity is AWS IAM, Microsoft Entra ID with Azure RBAC, and Google Cloud IAM. Learn one column well and the comparison table translates the rest.",
          nuance: "Learn one provider deeply and the others become translation. The ideas (IAM, VPCs, object storage, managed Postgres) carry over; the names, defaults, quotas and pricing are what differ, and the defaults are where outages and surprise bills come from.",
          read: [{ label: "Google Cloud: service comparison table across AWS, Azure and Google Cloud", url: "https://docs.cloud.google.com/docs/get-started/aws-azure-gcp-service-comparison", m: 15 }],
          tags: ["aws", "azure", "gcp", "oracle", "coreweave"] },
        { id: "developer-platforms", name: "Developer platforms",
          line: "Vercel, Supabase, Cloudflare, Railway and Modal: opinionated layers that hide the console.",
          body: [
            "A developer platform packages cloud primitives behind one workflow. **Vercel** deploys a frontend and its server functions from a git push, with a preview per branch. **Supabase** gives a project Postgres plus auth, an auto-generated REST API, realtime, storage and edge functions. **Cloudflare** runs code in V8 isolates in hundreds of cities, alongside R2 storage with no egress fee. **Railway** and Render run any container from a repo. **Modal** runs Python functions on serverless GPUs.",
            "Many run on top of the big clouds, so you pay their margin for a better default path."
          ],
          uses: [
            "**Vercel**: turns every pull request into a preview URL, so a reviewer clicks the running branch instead of pulling it.",
            "**Supabase**: backs many small AI products with Postgres, row-level security and auth in one project, and pgvector for embeddings.",
            "**Modal**: runs batch GPU jobs and model inference as decorated Python functions, billed per second and scaled to zero between calls."
          ],
          example: "A typical 2026 AI product: Next.js on Vercel, Postgres and auth on Supabase, model calls to a hosted API, batch GPU jobs on Modal, and Cloudflare in front for DNS and caching. One engineer can ship it in a weekend. A year later, a function timeout on a long agent run is the first wall, and that one service moves to a container on Cloud Run.",
          nuance: "They are fastest at the start and most limiting at the edges: function timeouts, region choice, network control and per-unit price. Know which primitive each one wraps (Supabase is Postgres, Vercel functions are serverless functions) so you can leave when you outgrow it.",
          read: [
            { label: "Supabase docs: architecture, the components of a project", url: "https://supabase.com/docs/guides/getting-started/architecture", m: 6 },
            { label: "Cloudflare Workers: how Workers works (isolates against containers)", url: "https://developers.cloudflare.com/workers/reference/how-workers-works/", m: 8 }
          ],
          tags: ["vercel", "supabase", "cloudflare", "railway", "modal", "render"] }
      ] },
    { name: "Compute and storage", line: "What you actually rent: machines in their several shapes, and places to keep bytes.",
      topics: [
        { id: "virtual-machines", name: "Virtual machines",
          line: "A slice of a physical server, with its own kernel, rented by the second.",
          body: [
            "A hypervisor splits one physical server into many virtual machines, each with its own virtual CPUs, memory and operating system: EC2 on AWS, Compute Engine on Google, Virtual Machines on Azure. You choose an **instance type** (a fixed bundle such as 4 vCPUs and 16 GB), a boot image, a disk and a subnet. Families are tuned for a job: general purpose, compute, memory, storage, GPU.",
            "AWS Nitro cards offload networking and storage to dedicated hardware, so a VM gets close to bare-metal speed. An **autoscaling group** keeps a target number of identical VMs across zones and replaces any that fail a health check."
          ],
          uses: [
            "**Kubernetes nodes**: EKS, GKE and AKS worker nodes are ordinary VMs; the cluster schedules containers onto them.",
            "**Amazon RDS**: managed databases and most PaaS products run on VMs the provider operates for you.",
            "**Self-run and licensed software**: teams still run VMs directly for databases they tune themselves, vendor software, and anything that needs a custom kernel."
          ],
          example: "An `m7i.xlarge` on AWS is 4 vCPUs and 16 GB. An autoscaling group set to min 2, max 10, target 50% CPU runs two of them at night. At the morning peak average CPU hits 80%, so the group launches more from the same image until the average falls back near 50%, then terminates the extras in the evening.",
          nuance: "Treat VMs as cattle, not pets. A VM can be retired by the provider for hardware maintenance; one you configured by hand over SSH cannot be rebuilt. Bake images or use configuration as code so any instance can be replaced in minutes.",
          tags: ["ec2", "hypervisor", "nitro", "autoscaling", "instance type"] },
        { id: "containers", name: "Containers on the cloud",
          line: "Packaged apps run by a managed scheduler, from Cloud Run to managed Kubernetes.",
          body: [
            "A container image bundles an app with its libraries so it runs the same anywhere. The cloud question is who runs the containers. **Managed Kubernetes** (EKS, GKE, AKS) gives you a cluster whose control plane the provider operates; you usually still own the nodes and the YAML. **Serverless containers** (Cloud Run, AWS Fargate, Azure Container Apps) take an image and run it with no cluster: you set CPU, memory and concurrency, and it scales on traffic, Cloud Run down to zero.",
            "Kubernetes gives control and portability at the cost of a team to run it; Cloud Run gives a URL from an image in a minute."
          ],
          uses: [
            "**Google Cloud Run**: a common home for API services and AI agents that need longer requests than a function allows, up to 60 minutes each.",
            "**EKS and GKE at large companies**: run hundreds of services, with an internal platform team in front so product teams deploy without touching the cluster.",
            "**AWS Fargate**: runs ECS or EKS tasks without any EC2 nodes to manage, billed for the vCPU and memory each task asks for."
          ],
          example: "Deploy an image to Cloud Run with concurrency 80 and you get a public HTTPS URL. With no traffic it runs zero instances. A spike of 800 concurrent requests starts about ten instances, each serving up to 80 at once, and they wind down a few minutes after the spike ends. The first request after idle waits for a cold start.",
          nuance: "Do not start with Kubernetes because large companies use it. Its value appears with many services and a team to operate it; for a handful of services, a serverless container platform is less work and often cheaper.",
          see: [{ label: "DevOps tab: Kubernetes", href: "BASELINE.html#/devops/kubernetes" }],
          tags: ["eks", "gke", "aks", "cloud run", "fargate", "ecs"] },
        { id: "serverless", name: "Serverless functions",
          line: "Code that runs per event, scales to zero, and bills by the millisecond.",
          body: [
            "A function platform (AWS Lambda, Cloud Run functions, Azure Functions) runs a handler when an event arrives: an HTTP request, a file landing in a bucket, a queue message, a timer. It starts an execution environment, runs the code, may keep it warm for the next call, and bills for the time used. With no traffic, nothing runs and nothing is billed.",
            "Lambda runs each environment in a **Firecracker** microVM, which boots in under 125 ms with under 5 MiB of overhead. The first request into a new environment pays a **cold start**; later ones reuse it."
          ],
          uses: [
            "**AWS Lambda**: resizes an image when it lands in S3, drains a queue, or runs a nightly job, gluing AWS services together.",
            "**Vercel and Netlify**: run web backends and API routes as functions deployed alongside the frontend.",
            "**Cloudflare Workers**: use V8 isolates instead of VMs, so a function starts in milliseconds in hundreds of cities."
          ],
          example: "Upload `cat.jpg` to an S3 bucket. S3 emits an event, Lambda starts an environment (a cold start of a few hundred milliseconds for Python), and the handler writes a 200-pixel thumbnail to another bucket in 300 ms. The bill is those 300 ms times the memory size. A second upload a minute later reuses the warm environment and skips the cold start.",
          nuance: "Functions are stateless and time-limited (Lambda stops at 15 minutes), and each instance handles one request at a time on Lambda, so a burst of traffic opens a burst of database connections. Put a connection pooler in front of the database.",
          read: [{ label: "Firecracker: the microVM project page and its figures", url: "https://firecracker-microvm.github.io/", m: 5 }],
          tags: ["lambda", "faas", "cold start", "firecracker", "workers"] },
        { id: "gpus", name: "GPUs in the cloud",
          line: "Rented accelerators for training and inference, priced high and often in short supply.",
          body: [
            "A GPU runs thousands of simple arithmetic operations in parallel, which is what neural networks need. Clouds rent them as instances (AWS `p5` carries eight H100s), as serverless GPUs (Modal, Replicate), or as reserved clusters for training. Google also rents its own TPUs. What limits a model is often GPU memory (HBM) and the bandwidth between GPUs, not raw compute.",
            "Supply is the defining fact: since 2023, demand for NVIDIA data-centre GPUs has outrun supply. On-demand capacity in a region can be zero, so providers sell reserved blocks (AWS Capacity Blocks, for example) to teams that need a guarantee."
          ],
          uses: [
            "**Frontier labs**: OpenAI, Anthropic and Meta reserve very large accelerator clusters across Azure, AWS, Google, Oracle and CoreWeave for training and serving.",
            "**Modal, Baseten and Together**: pool GPU capacity and bill per second, so smaller teams can serve a model without reserving a card.",
            "**Google TPUs**: train and serve Gemini, and are rented to outside customers through Google Cloud."
          ],
          example: "A 70B-parameter model in 16-bit weights needs about 140 GB for the weights alone, more than one 80 GB H100 holds. So it is split across two or more GPUs, or quantised to 8-bit (about 70 GB) to fit on one card with a little room left for the KV cache. Memory, not compute, picked the hardware.",
          nuance: "A GPU you rent but cannot keep busy is the most expensive idle machine in the cloud. Batching requests, picking a smaller card for a smaller model, and scaling to zero matter more to cost than the hourly price.",
          read: [{ label: "Modal GPU glossary: device hardware and performance sections", url: "https://modal.com/gpu-glossary", m: 30 }],
          see: [{ label: "Inference tab", href: "BASELINE.html#/inference" }],
          tags: ["gpu", "h100", "tpu", "capacity", "neocloud"] },
        { id: "storage", name: "Block, object and file storage",
          line: "Three ways to keep bytes: a virtual disk, a key-value blob store, a shared filesystem.",
          body: [
            "**Block storage** (AWS EBS, Persistent Disk) is a virtual disk attached to one VM in one zone; a database lives on it. **Object storage** (S3, Google Cloud Storage, Azure Blob, Cloudflare R2) stores whole files as objects under keys in a bucket, read and written over HTTP. It holds effectively unlimited data, copies it across zones and is cheap per gigabyte, but you replace an object rather than edit it in place. **File storage** (EFS, Filestore) is a network filesystem many machines mount at once.",
            "S3 has given strong read-after-write consistency since December 2020."
          ],
          uses: [
            "**Amazon S3**: holds data lakes, backups, ML datasets and model weights, and serves user uploads through presigned URLs.",
            "**EBS under a database**: Postgres on EC2 or RDS keeps its data files on block volumes, sized for IOPS as much as for capacity.",
            "**EFS and Filestore**: give legacy apps and some training clusters one shared directory that many machines read at once."
          ],
          example: "A user uploads a 20 MB video. The API returns a presigned S3 URL valid for 10 minutes; the browser sends a `PUT` with the file straight to S3 under `uploads/u42/v1.mp4`, never touching the app servers. A worker reads it, writes a transcoded copy under a new key, and the database row stores only the key.",
          nuance: "Storage is cheap to keep and expensive to move. Reading terabytes out of S3 to the internet, or across regions, can cost more than storing it for a year. And a public bucket is still one of the most common causes of data leaks.",
          read: [{ label: "AWS: the difference between block, file and object storage", url: "https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/", m: 8 }],
          see: [{ label: "System design guide: presigned uploads", href: "SYSTEM%20DESIGN.html#/patterns/large-blobs/presigned" }],
          tags: ["s3", "ebs", "efs", "r2", "gcs", "blob"] }
      ] },
    { name: "Networking and data", line: "How requests find your machines, and the databases someone else keeps running.",
      topics: [
        { id: "vpc", name: "VPCs and subnets",
          line: "Your own private network inside the provider's, divided into public and private subnets.",
          body: [
            "A **virtual private cloud** is an isolated network with an IP range you choose (say `10.0.0.0/16`), cut into **subnets**, each in one availability zone. A **route table** decides where each subnet's traffic goes. A **public subnet** routes to an internet gateway; a **private subnet** does not, and reaches out through a **NAT gateway** that allows outbound calls but no inbound ones.",
            "The usual layout puts load balancers in public subnets and app servers and databases in private ones. **Security groups** are stateful firewalls on each instance; network ACLs are coarser, stateless rules on a subnet."
          ],
          uses: [
            "**The AWS default VPC**: every account gets one in each region, so a first EC2 instance has a network with no setup.",
            "**Production and staging**: companies keep them in separate VPCs or accounts, so a mistake in one cannot reach the other's database.",
            "**VPC endpoints**: let traffic to S3 or a managed database stay on the provider's network instead of crossing the internet."
          ],
          example: "VPC `10.0.0.0/16`. Public subnet `10.0.1.0/24` holds the load balancer, private subnet `10.0.2.0/24` the app, `10.0.3.0/24` Postgres. The database's security group allows port 5432 only from the app's security group. An attacker who learns the database's address still cannot reach it: nothing routes in from the internet, and the firewall admits only the app.",
          nuance: "The NAT gateway is a classic surprise bill: it charges per gigabyte processed, so a private service pulling large images or model weights through it pays twice. A VPC endpoint for the storage service avoids that.",
          read: [{ label: "AWS VPC docs: How Amazon VPC works", url: "https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html", m: 12 }],
          tags: ["vpc", "subnet", "nat", "security group", "cidr"] },
        { id: "load-balancers", name: "Load balancers",
          line: "One address in front of many servers, sending each request to a healthy one.",
          body: [
            "A load balancer takes traffic on one address and spreads it across a pool of targets, checking each target's health and dropping those that fail. **Layer 4** balancers (AWS NLB) route TCP or UDP connections by address and port. **Layer 7** balancers (AWS ALB, Google's application load balancer) read HTTP: they route by path or host, terminate TLS, and add headers such as `X-Forwarded-For`.",
            "The managed balancer is itself many nodes, one per enabled zone, found through DNS with a short TTL (60 s on AWS) so the provider can add nodes as traffic grows."
          ],
          uses: [
            "**AWS ALB**: fronts most web services on AWS, routing `/api` to one target group and everything else to another.",
            "**Kubernetes ingress**: controllers such as the AWS Load Balancer Controller create a cloud balancer per cluster or per service.",
            "**Google's global load balancer**: gives one anycast IP for backends in many regions, sending each user to the nearest healthy one."
          ],
          example: "Three app servers sit behind an ALB configured to check `GET /health` every 10 seconds. Server B starts returning 500s after a bad config push. After two failed checks it is marked unhealthy and gets no new requests; A and C take its share. Fix B, it passes its checks again, and it rejoins the pool with no DNS change.",
          nuance: "A load balancer spreads load, not state. Sticky sessions pin a user to a server, which breaks even distribution and loses the session when that server dies. Keep servers stateless and session state in a shared store.",
          read: [{ label: "AWS Elastic Load Balancing: how it works", url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html", m: 12 }],
          tags: ["alb", "nlb", "l4", "l7", "health check", "ingress"] },
        { id: "dns", name: "DNS",
          line: "The internet's phone book, cached at every step, and a common cause of outages.",
          body: [
            "DNS turns a name such as `api.example.com` into an IP address. Your machine asks a **recursive resolver** (your ISP's, or 1.1.1.1), which asks a **root** server, then the `.com` **TLD** server, then the domain's **authoritative** server, and caches each answer for its **TTL**. Record types: `A` and `AAAA` for addresses, `CNAME` for an alias, `MX` for mail, `TXT` for verification and email policy.",
            "In the cloud, DNS is also routing: Route 53 and Cloudflare can answer by latency, geography, weight or health, which is how traffic shifts between regions in a failover."
          ],
          uses: [
            "**Route 53 and Cloudflare DNS**: host a large share of domains, and serve health-checked records that steer traffic away from a failed region.",
            "**Dyn, 2016**: a botnet DDoS on this DNS provider made Twitter, GitHub and others unreachable though their own servers were fine.",
            "**AWS us-east-1, October 2025**: the outage began when the DNS record for DynamoDB's regional endpoint was left empty, and everything depending on it failed."
          ],
          example: "`dig api.example.com` on a cold cache: the resolver asks a root server (\"try the .com servers\"), a `.com` server (\"try ns1.example.com\"), then `ns1.example.com`, which answers `203.0.113.7` with TTL 300. For the next five minutes, everyone using that resolver gets the cached answer in about a millisecond instead of three round trips.",
          nuance: "A DNS change is not instant: resolvers keep the old answer until its TTL expires, and some ignore TTLs. Lower the TTL a day before a planned migration, not during it.",
          read: [{ label: "Julia Evans: Implement DNS in a weekend (a resolver in about 200 lines of Python)", url: "https://implement-dns.wizardzines.com/", m: 120 }],
          tags: ["dns", "route 53", "ttl", "resolver", "cname"] },
        { id: "cdn", name: "CDNs and the edge",
          line: "Caches in hundreds of cities that answer before the request reaches your servers.",
          body: [
            "A content delivery network keeps copies of responses in points of presence close to users. A request goes to the nearest edge, via anycast or DNS; on a **hit** the edge answers in milliseconds, on a **miss** it fetches from your origin, stores the response per its `Cache-Control` header, and serves later users from the copy.",
            "CDNs now also terminate TLS, absorb DDoS attacks, run a web application firewall, and execute code at the edge (Cloudflare Workers, CloudFront Functions) for redirects, auth checks and personalisation."
          ],
          uses: [
            "**Cloudflare, Akamai, Fastly and CloudFront**: carry a large share of web traffic, sitting in front of origins as cache, TLS terminator and DDoS shield.",
            "**Netflix Open Connect**: Netflix's own CDN, with cache servers placed inside ISPs so most video bytes never cross the wider internet.",
            "**Fastly, June 2021**: a customer's configuration change triggered a latent bug that briefly took down major news sites and government pages worldwide."
          ],
          example: "A site hosted in Virginia serves `app.3f9a.js` with `Cache-Control: public, max-age=31536000, immutable`. The first user in Mumbai misses, and the Mumbai edge fetches the file from Virginia in about 250 ms. Every later Mumbai user gets it from the edge in about 20 ms. The next release ships `app.7c21.js`, a new URL, so nothing needs purging.",
          nuance: "Caching is easy; invalidation is the hard part. Caching a response that contains one user's data and serving it to another is a real and recurring leak. Cache public content, set `private` on anything personal, and version asset URLs instead of purging.",
          see: [{ label: "System design guide: CDN and edge caching", href: "SYSTEM%20DESIGN.html#/patterns/scaling-reads/cdn" }],
          tags: ["cdn", "edge", "cloudflare", "fastly", "akamai", "cache-control"] },
        { id: "managed-databases", name: "Managed databases",
          line: "The provider runs the database server: backups, patches, replicas and failover included.",
          body: [
            "A managed database (Amazon RDS, Google Cloud SQL, Azure Database for PostgreSQL) is a database engine on VMs the provider operates. You choose the engine and size; it handles patching, daily backups with point-in-time restore, read replicas, and a standby in another zone that takes over if the primary fails, typically within a minute or two.",
            "Cloud-native designs separate compute from storage. **Aurora** sends only the redo log to a storage layer that keeps six copies across three zones. **Neon** offers branchable serverless Postgres; **DynamoDB** and Spanner are managed distributed databases with their own data models."
          ],
          uses: [
            "**Postgres at startups**: most run it on RDS, Cloud SQL, Supabase or Neon rather than on a VM they patch and back up themselves.",
            "**DynamoDB at Amazon**: Amazon's retail systems lean heavily on it, including through Prime Day peaks.",
            "**Google Spanner**: holds data that must stay consistent across continents, such as Google's ads data, using synchronised clocks to order transactions."
          ],
          example: "At 14:05 someone runs `DELETE FROM orders` without a `WHERE`. On RDS you restore to a new instance as of 14:04: the last snapshot plus the transaction logs replayed up to that minute. You copy the lost rows back and delete the new instance. No backup script of yours was involved.",
          nuance: "Managed does not mean tuned. The provider keeps the server alive; slow queries, missing indexes, connection limits and schema design are still yours. Failover also drops open connections, so the app must reconnect and retry.",
          read: [{ label: "Amazon Aurora paper (SIGMOD 2017): design for a cloud-native relational database", url: "https://www.amazon.science/publications/amazon-aurora-design-considerations-for-high-throughput-cloud-native-relational-databases", m: 40 }],
          see: [{ label: "System design guide: replication and failover", href: "SYSTEM%20DESIGN.html#/patterns/reliability/replication-failover" }],
          tags: ["rds", "aurora", "cloud sql", "neon", "dynamodb", "spanner"] }
      ] },
    { name: "Running it safely and cheaply", line: "Permissions, the bill, surviving a region, and the cost of leaving.",
      topics: [
        { id: "iam", name: "IAM and least privilege",
          line: "Every API call is checked against policies: who may do which action on which resource.",
          body: [
            "Identity and access management decides every request to the cloud's API. A **principal** (a person, or a workload's **role**) makes a call; **policies** (JSON documents on AWS) list which actions it may take on which resources, under which conditions. Everything is denied unless a policy allows it, and an explicit deny wins.",
            "Two habits matter most. Give workloads **roles** with short-lived credentials the platform rotates, not long-lived keys in config. And grant **least privilege**: the specific actions on the specific bucket or table, not `s3:*` on everything."
          ],
          uses: [
            "**Capital One, 2019**: an SSRF bug let an attacker read a VM's role credentials from the metadata service, and the role could read far more S3 data than the app needed.",
            "**AWS IMDSv2**: the token-based metadata service added in 2019, which closes the simple SSRF path to a VM's credentials.",
            "**GitHub Actions OIDC**: a workflow exchanges a signed token for a short-lived cloud role on each run, so no access key is stored in the repo."
          ],
          example: "A worker resizes images. Its role allows `s3:GetObject` on `arn:aws:s3:::uploads/*` and `s3:PutObject` on `arn:aws:s3:::thumbs/*`, nothing else. If the worker is compromised, the attacker can read uploads and write thumbnails. They cannot list other buckets, delete anything, read the database or start instances.",
          nuance: "Over-broad permissions are invisible until they are used against you. Start broad while exploring if you must, then cut down using the access logs; tools such as IAM Access Analyzer generate a tight policy from what a role actually called.",
          read: [{ label: "AWS IAM: security best practices (temporary credentials, least privilege)", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", m: 15 }],
          see: [{ label: "System design guide: least privilege for agents", href: "SYSTEM%20DESIGN.html#/patterns/agent-safety/least-privilege" }],
          tags: ["iam", "rbac", "least privilege", "role", "policy", "imds"] },
        { id: "cloud-cost", name: "Cloud cost and egress",
          line: "Metered billing for everything, with data leaving the cloud the classic hidden charge.",
          body: [
            "Every resource has a meter: VM hours, disk gigabyte-months, requests, network traffic. **Egress**, data sent out of the provider to the internet or another region, is the charge teams forget; the big three bill it per gigabyte (around nine cents on AWS for the first tiers) while ingress is free. Idle resources are the other leak: forgotten dev environments, unattached disks, oversized instances.",
            "**FinOps** is the practice of making engineers see and own that spend: tag every resource with a team, show cost per service and per customer, and treat a cost jump like a performance regression."
          ],
          uses: [
            "**Cloudflare R2**: object storage that charges no egress fee, aimed squarely at this pain.",
            "**Egress waivers, 2024**: Google, AWS and Azure began waiving egress fees for customers moving out entirely, under pressure from the EU Data Act.",
            "**AI products**: track GPU time and token spend per request and per customer, since one heavy user can cost more than they pay."
          ],
          example: "A service serves 50 TB a month of downloads straight from S3. At about $0.09 per GB for the first 10 TB and a little less after, egress runs to several thousand dollars a month, far more than the roughly $1,200 it costs to store 50 TB. A CDN in front with a 95% hit ratio cuts what leaves S3 to 2.5 TB.",
          nuance: "Architecture decides most of the bill, not discounts. A design that copies data across regions, through a NAT gateway or out to another cloud pays forever; fixing it later is a migration.",
          read: [
            { label: "FinOps Foundation: what FinOps is", url: "https://www.finops.org/introduction/what-is-finops/", m: 10 },
            { label: "Cloudflare blog (2021): AWS's egregious egress, a critique of egress pricing", url: "https://blog.cloudflare.com/aws-egregious-egress/", m: 12 }
          ],
          tags: ["egress", "finops", "billing", "tagging", "r2"] },
        { id: "spot-and-reserved", name: "On-demand, reserved and spot",
          line: "Pay full price for flexibility, commit for a discount, or bid for spare capacity.",
          body: [
            "**On-demand** is the list price: start and stop any time. **Reserved instances** and **savings plans** trade a one- or three-year commitment for a large discount, which suits a service's steady baseline. **Spot** instances sell spare capacity at up to 90% off, but the provider can reclaim them, with a two-minute warning on AWS (Google and Azure call theirs spot VMs).",
            "The usual mix covers the steady floor with commitments, peaks with on-demand, and anything interruptible (batch jobs, CI runners, rendering, training with checkpoints) with spot."
          ],
          uses: [
            "**Karpenter on EKS**: picks spot or on-demand nodes per workload and replaces reclaimed spot nodes automatically.",
            "**CI runner fleets**: CI providers and data teams run large pools on spot, since a killed job only needs a retry.",
            "**AI training**: GPU commitments run to years and billions of dollars, because on-demand capacity for large clusters often does not exist."
          ],
          example: "A service needs 10 instances all day and 25 at the evening peak. Cover the 10 with a three-year savings plan, run the extra 15 on-demand for the four peak hours, and push the nightly report job onto spot. If AWS reclaims a spot node, the job's checkpoint lets the retry resume from the last finished batch instead of the start.",
          nuance: "Spot is only cheap if the work survives being killed. Without checkpoints and retries, a reclaimed node loses the work and you pay twice. Commitments carry the opposite risk: paying for capacity your architecture no longer uses.",
          read: [{ label: "AWS EC2 docs: Spot Instance interruption notices", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html", m: 6 }],
          tags: ["spot", "reserved", "savings plans", "preemptible", "karpenter"] },
        { id: "disaster-recovery", name: "Multi-region and disaster recovery",
          line: "Planning for losing a whole region: how much data, and how much downtime, you accept.",
          body: [
            "Two numbers frame the plan. **RPO** is how much recent data you can lose; **RTO** is how long you can be down. Four strategies trade cost against both. **Backup and restore** rebuilds in another region from copies: cheap, hours to recover. **Pilot light** keeps data replicated and core infrastructure ready but off. **Warm standby** runs a small working copy that scales up on failover. **Active-active** serves from several regions at once: near-zero RTO, and the hard problem of writes in two places.",
            "Recovery depends on infrastructure as code to rebuild and on DNS or global load balancers to move traffic."
          ],
          uses: [
            "**Banks and payment companies**: run warm standby or active-active, often because regulators expect a tested recovery time.",
            "**Most SaaS products**: accept a regional outage and rely on multi-AZ, backups and a rehearsed restore.",
            "**DynamoDB global tables and Aurora global databases**: replicate across regions in about a second, the building block for warm standby and active-active."
          ],
          example: "An app sets RPO at 5 minutes and RTO at 1 hour. Nightly snapshots alone fail the RPO: up to 24 hours could be lost. Aurora cross-region replication, about a second behind, meets it. For the RTO, the Terraform for the second region is applied in a monthly drill, and a Route 53 failover record moves traffic once the standby is promoted.",
          nuance: "Replication copies mistakes too: a dropped table or corrupted write reaches every region in seconds, so point-in-time backups remain essential. And a recovery plan never rehearsed is a hope, not a plan.",
          read: [{ label: "AWS whitepaper: disaster recovery options in the cloud (the four strategies)", url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html", m: 25 }],
          see: [{ label: "System design guide: multi-region and backups", href: "SYSTEM%20DESIGN.html#/patterns/reliability/multi-region" }],
          tags: ["rpo", "rto", "active-active", "failover", "backup"] },
        { id: "lock-in", name: "Vendor lock-in",
          line: "The cost of leaving a provider, made of proprietary services, data gravity and egress.",
          body: [
            "Lock-in is not yes or no; it is the price of switching. It grows with every proprietary service you depend on (DynamoDB, BigQuery, Lambda triggers, provider IAM), with the data you would have to move and pay egress on, and with the tooling built around one console.",
            "Portable choices lower the price: Postgres over a proprietary database, containers over provider-specific runtimes, Terraform over one provider's templates, S3-compatible storage, OpenTelemetry for telemetry. The Twelve-Factor rule of treating every backing service as an attached resource, swapped by config, keeps the code portable."
          ],
          uses: [
            "**37signals**: moved its apps off AWS onto its own servers in 2023, citing the cost of steady, predictable load.",
            "**Multi-cloud Kubernetes**: many companies run clusters on two clouds mostly to keep a credible exit and negotiate price.",
            "**Supabase and Neon**: sell plain Postgres, so a project can leave with `pg_dump` and the app's queries still work."
          ],
          example: "Two versions of one feature. Version A stores events in DynamoDB and triggers Lambda from its stream; moving clouds means a new data model, new triggers and a migration. Version B writes to Postgres and a container polls a jobs table; moving means `pg_dump`, a restore and a new connection string. B costs a little more to run today and far less to leave.",
          nuance: "Avoiding all lock-in means using only the lowest common denominator and running more yourself, which has its own cost. Accept lock-in where a managed service saves real work, and keep the data in a format you can export.",
          read: [{ label: "The Twelve-Factor App: IV, backing services", url: "https://12factor.net/backing-services", m: 3 }],
          tags: ["lock-in", "portability", "repatriation", "multi-cloud"] }
      ] }
  ],
  see: [
    { label: "System design guide: reliability patterns", href: "SYSTEM%20DESIGN.html#/patterns/reliability/multi-region" },
    { label: "DevOps, security and reliability", href: "BASELINE.html#/devops" }
  ]
});

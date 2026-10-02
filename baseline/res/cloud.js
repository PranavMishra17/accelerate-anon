/* What to read and watch for each topic in the cloud field: at most two articles and two videos, Required and Optional
   (site/res.js draws them). Preferred over a topic's own read list. */
BASELINE.res("cloud", {
 "what-is-cloud": [
  {
   "kind": "video",
   "req": true,
   "label": "Why you're addicted to cloud computing",
   "url": "https://www.youtube.com/watch?v=4Wa5DivljOM",
   "m": 6,
   "why": "Why renting compute on demand beat buying servers, in plain terms.",
   "yt": {
    "id": "4Wa5DivljOM",
    "ch": "Fireship"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Cloud computing explained",
   "url": "https://www.youtube.com/watch?v=_a6us8kaq0g",
   "m": 9,
   "why": "An animated pass over the five traits and the main models.",
   "yt": {
    "id": "_a6us8kaq0g",
    "ch": "PowerCert Animated Videos"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "NIST SP 800-145: the definition and its five characteristics",
   "url": "https://csrc.nist.gov/pubs/sp/800/145/final",
   "m": 10,
   "why": "The official definition and its five characteristics."
  }
 ],
 "regions-zones": [
  {
   "kind": "video",
   "req": true,
   "label": "AWS global infrastructure overview: regions, availability zones, edge locations",
   "url": "https://www.youtube.com/watch?v=0hlZvybbaGk",
   "m": 7,
   "why": "Regions, zones and edge locations drawn on one map.",
   "yt": {
    "id": "0hlZvybbaGk",
    "ch": "Digital Cloud Training"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWS EC2 docs: Regions and Zones",
   "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html",
   "m": 8,
   "why": "The exact terms: region, zone, local zone."
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS Builders' Library: Static stability using Availability Zones",
   "url": "https://aws.amazon.com/builders-library/static-stability-using-availability-zones/",
   "m": 20,
   "why": "Why a zone failure should not take you down."
  }
 ],
 "service-models": [
  {
   "kind": "video",
   "req": true,
   "label": "What is cloud architecture? SaaS, IaaS and cloud delivery models",
   "url": "https://www.youtube.com/watch?v=phLPKVx3Cl4",
   "m": 14,
   "why": "What you rent and what you still run, across IaaS, PaaS and SaaS.",
   "yt": {
    "id": "phLPKVx3Cl4",
    "ch": "IBM Technology"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Cloud fundamentals: IaaS, PaaS and SaaS explained",
   "url": "https://www.youtube.com/watch?v=YpXpmc6lTEg",
   "m": 6,
   "why": "A shorter second pass if the first does not click.",
   "yt": {
    "id": "YpXpmc6lTEg",
    "ch": "Travis Roberts"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS: the shared responsibility model",
   "url": "https://aws.amazon.com/compliance/shared-responsibility-model/",
   "m": 6,
   "why": "Where the provider's job ends and yours starts."
  }
 ],
 "big-three": [
  {
   "kind": "video",
   "req": true,
   "label": "Top 50+ AWS services explained in 10 minutes",
   "url": "https://www.youtube.com/watch?v=JIbIYCM48to",
   "m": 12,
   "why": "The service families every provider has, with the AWS names.",
   "yt": {
    "id": "JIbIYCM48to",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "Google Cloud: service comparison table across AWS, Azure and Google Cloud",
   "url": "https://docs.cloud.google.com/docs/get-started/aws-azure-gcp-service-comparison",
   "m": 15,
   "why": "One table mapping AWS, Azure and Google Cloud service names."
  }
 ],
 "developer-platforms": [
  {
   "kind": "video",
   "req": true,
   "label": "Cloudflare Workers explained",
   "url": "https://www.youtube.com/watch?v=WDhruDqb5nM",
   "m": 6,
   "why": "What Workers is and why it starts faster than a container.",
   "yt": {
    "id": "WDhruDqb5nM",
    "ch": "Cloudflare Developers"
   }
  },
  {
   "kind": "video",
   "req": true,
   "label": "Supabase in 100 seconds",
   "url": "https://www.youtube.com/watch?v=zBZgdTb-dns",
   "m": 3,
   "why": "What a Supabase project is made of, in three minutes.",
   "yt": {
    "id": "zBZgdTb-dns",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Supabase docs: architecture, the components of a project",
   "url": "https://supabase.com/docs/guides/getting-started/architecture",
   "m": 6,
   "why": "The components of a Supabase project."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Cloudflare Workers: how Workers works (isolates against containers)",
   "url": "https://developers.cloudflare.com/workers/reference/how-workers-works/",
   "m": 8,
   "why": "Isolates against containers, the core idea behind Workers."
  }
 ],
 "virtual-machines": [
  {
   "kind": "video",
   "req": true,
   "label": "Containers vs VMs: what's the difference?",
   "url": "https://www.youtube.com/watch?v=cjXI-yxqGTI",
   "m": 9,
   "why": "How a VM differs from a container: own kernel against shared kernel.",
   "yt": {
    "id": "cjXI-yxqGTI",
    "ch": "IBM Technology"
   }
  }
 ],
 "containers": [
  {
   "kind": "video",
   "req": true,
   "label": "Running serverless containers: AWS Fargate and Google Cloud Run",
   "url": "https://www.youtube.com/watch?v=0jOj6P4WOtc",
   "m": 3,
   "why": "Fargate and Cloud Run: containers without managing servers.",
   "yt": {
    "id": "0jOj6P4WOtc",
    "ch": "in28minutes"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Kubernetes explained in 6 minutes",
   "url": "https://www.youtube.com/watch?v=TlHvYWVUZyc",
   "m": 7,
   "why": "What the scheduler does in managed Kubernetes.",
   "yt": {
    "id": "TlHvYWVUZyc",
    "ch": "ByteByteGo"
   }
  }
 ],
 "serverless": [
  {
   "kind": "video",
   "req": true,
   "label": "Why does serverless architecture have cold starts?",
   "url": "https://www.youtube.com/watch?v=x6-aC-TN5Ek",
   "m": 4,
   "why": "Where cold starts come from and what they cost.",
   "yt": {
    "id": "x6-aC-TN5Ek",
    "ch": "Server Logic Simplified"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "How AWS Lambda works: Firecracker microVMs explained",
   "url": "https://www.youtube.com/watch?v=Odf4iAmqsIw",
   "m": 4,
   "why": "The microVM that makes a function start in milliseconds.",
   "yt": {
    "id": "Odf4iAmqsIw",
    "ch": "Why This in Tech?"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Firecracker: the microVM project page and its figures",
   "url": "https://firecracker-microvm.github.io/",
   "m": 5,
   "why": "Firecracker's own page and figures."
  }
 ],
 "gpus": [
  {
   "kind": "video",
   "req": true,
   "label": "GPUs: explained",
   "url": "https://www.youtube.com/watch?v=LfdK-v0SbGI",
   "m": 8,
   "why": "What a GPU is for and why AI wants one.",
   "yt": {
    "id": "LfdK-v0SbGI",
    "ch": "IBM Technology"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Serverless GPU: deploy AI models in seconds, not hours",
   "url": "https://www.youtube.com/watch?v=Png_oUi_jQk",
   "m": 12,
   "why": "Renting a GPU per second instead of per month.",
   "yt": {
    "id": "Png_oUi_jQk",
    "ch": "ByteMonk"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Modal GPU glossary: device hardware and performance sections",
   "url": "https://modal.com/gpu-glossary",
   "m": 30,
   "why": "Device hardware and performance sections of the glossary."
  }
 ],
 "storage": [
  {
   "kind": "video",
   "req": true,
   "label": "AWS storage: EBS vs S3 vs EFS",
   "url": "https://www.youtube.com/watch?v=_CN7KqC3y3s",
   "m": 7,
   "why": "Block, object and file storage mapped to EBS, S3 and EFS.",
   "yt": {
    "id": "_CN7KqC3y3s",
    "ch": "Cloud Simplified"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS: the difference between block, file and object storage",
   "url": "https://aws.amazon.com/compare/the-difference-between-block-file-object-storage/",
   "m": 8,
   "why": "The three kinds side by side."
  }
 ],
 "vpc": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a Virtual Private Cloud?",
   "url": "https://www.youtube.com/watch?v=NbkPRn1mqlU",
   "m": 5,
   "why": "A private network inside the provider's, and why you want one.",
   "yt": {
    "id": "NbkPRn1mqlU",
    "ch": "IBM Technology"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Amazon VPC basics: subnets, gateways and route tables",
   "url": "https://www.youtube.com/watch?v=7_NNlnH7sAg",
   "m": 10,
   "why": "Subnets, gateways and route tables in the console.",
   "yt": {
    "id": "7_NNlnH7sAg",
    "ch": "Tiny Technical Tutorials"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS VPC docs: How Amazon VPC works",
   "url": "https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html",
   "m": 12,
   "why": "How the pieces of a VPC fit together."
  }
 ],
 "load-balancers": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a load balancer really about?",
   "url": "https://www.youtube.com/watch?v=LQuuoHTyYz8",
   "m": 7,
   "why": "What a load balancer does and the main algorithms.",
   "yt": {
    "id": "LQuuoHTyYz8",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "What is a load balancer?",
   "url": "https://www.youtube.com/watch?v=sCR3SAVdyCc",
   "m": 9,
   "why": "A second view with health checks.",
   "yt": {
    "id": "sCR3SAVdyCc",
    "ch": "IBM Technology"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS Elastic Load Balancing: how it works",
   "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html",
   "m": 12,
   "why": "How AWS's load balancer routes and checks health."
  }
 ],
 "dns": [
  {
   "kind": "video",
   "req": true,
   "label": "Everything you need to know about DNS",
   "url": "https://www.youtube.com/watch?v=27r4Bzuj5NQ",
   "m": 6,
   "why": "The resolution path from your laptop to the authoritative server.",
   "yt": {
    "id": "27r4Bzuj5NQ",
    "ch": "ByteByteGo"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "DNS explained in 100 seconds",
   "url": "https://www.youtube.com/watch?v=UVR9lhUGAyU",
   "m": 3,
   "why": "A three minute recap.",
   "yt": {
    "id": "UVR9lhUGAyU",
    "ch": "Fireship"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Julia Evans: Implement DNS in a weekend (a resolver in about 200 lines of Python)",
   "url": "https://implement-dns.wizardzines.com/",
   "m": 120,
   "why": "Build a resolver yourself; the deepest way to learn it."
  }
 ],
 "cdn": [
  {
   "kind": "video",
   "req": true,
   "label": "What is a CDN? How does it work?",
   "url": "https://www.youtube.com/watch?v=RI9np1LWzqw",
   "m": 5,
   "why": "How an edge cache answers before your origin sees the request.",
   "yt": {
    "id": "RI9np1LWzqw",
    "ch": "ByteByteGo"
   }
  }
 ],
 "managed-databases": [
  {
   "kind": "video",
   "req": true,
   "label": "What is storage-compute separation? Aurora paper deep dive",
   "url": "https://www.youtube.com/watch?v=DA5W8tO_7Nw",
   "m": 18,
   "why": "Why Aurora separates compute from storage.",
   "yt": {
    "id": "DA5W8tO_7Nw",
    "ch": "Arpit Bhayani"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "High availability and failover in Amazon Aurora",
   "url": "https://www.youtube.com/watch?v=ERMHycDc8ck",
   "m": 15,
   "why": "How failover works in a managed database.",
   "yt": {
    "id": "ERMHycDc8ck",
    "ch": "Amazon Web Services"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "Amazon Aurora paper (SIGMOD 2017): design for a cloud-native relational database",
   "url": "https://www.amazon.science/publications/amazon-aurora-design-considerations-for-high-throughput-cloud-native-relational-databases",
   "m": 40,
   "why": "The paper behind the design; read the introduction and section 3."
  }
 ],
 "iam": [
  {
   "kind": "video",
   "req": true,
   "label": "AWS IAM core concepts you need to know",
   "url": "https://www.youtube.com/watch?v=_ZCTvmaPgao",
   "m": 22,
   "why": "Users, roles and policies, with how a request is evaluated.",
   "yt": {
    "id": "_ZCTvmaPgao",
    "ch": "Be A Better Dev"
   }
  },
  {
   "kind": "read",
   "req": true,
   "label": "AWS IAM: security best practices (temporary credentials, least privilege)",
   "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
   "m": 15,
   "why": "The rules to follow: temporary credentials, least privilege."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Identity and access management (IAM)",
   "url": "https://www.youtube.com/watch?v=aNj36g7fSsU",
   "m": 4,
   "why": "The idea of IAM in four minutes.",
   "yt": {
    "id": "aNj36g7fSsU",
    "ch": "IBM Technology"
   }
  }
 ],
 "cloud-cost": [
  {
   "kind": "video",
   "req": true,
   "label": "How to burn money in the cloud: avoid AWS, GCP, Azure cost disasters",
   "url": "https://www.youtube.com/watch?v=N6lYcXjd4pg",
   "m": 9,
   "why": "The usual ways a cloud bill explodes.",
   "yt": {
    "id": "N6lYcXjd4pg",
    "ch": "Fireship"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "Cloud data transfer costs explained: egress and cross-region traffic",
   "url": "https://www.youtube.com/watch?v=roR1ThvwYDo",
   "m": 6,
   "why": "Where egress and cross-region charges come from.",
   "yt": {
    "id": "roR1ThvwYDo",
    "ch": "SystemDR - Scalable System Design "
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "FinOps Foundation: what FinOps is",
   "url": "https://www.finops.org/introduction/what-is-finops/",
   "m": 10,
   "why": "What FinOps is and who does it."
  },
  {
   "kind": "read",
   "req": false,
   "label": "Cloudflare blog (2021): AWS's egregious egress, a critique of egress pricing",
   "url": "https://blog.cloudflare.com/aws-egregious-egress/",
   "m": 12,
   "why": "The case that egress pricing is a lock-in tool."
  }
 ],
 "spot-and-reserved": [
  {
   "kind": "video",
   "req": true,
   "label": "Amazon EC2 pricing simply explained: on-demand, spot, reserved, savings plans",
   "url": "https://www.youtube.com/watch?v=-t148tYgnJU",
   "m": 10,
   "why": "On-demand, reserved, savings plans and spot in one comparison.",
   "yt": {
    "id": "-t148tYgnJU",
    "ch": "Tiny Technical Tutorials"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS EC2 docs: Spot Instance interruption notices",
   "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html",
   "m": 6,
   "why": "What the two minute spot warning looks like in practice."
  }
 ],
 "disaster-recovery": [
  {
   "kind": "video",
   "req": true,
   "label": "AWS disaster recovery strategies: backup, pilot light, warm standby, multi-site",
   "url": "https://www.youtube.com/watch?v=qZd6TokRWf0",
   "m": 8,
   "why": "The four strategies from backup to multi-site, with RTO and RPO.",
   "yt": {
    "id": "qZd6TokRWf0",
    "ch": "PnutStudios – Tech Simplified"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "The ultimate guide to disaster recovery: RTO, RPO and failover",
   "url": "https://www.youtube.com/watch?v=OmASCUJEVy8",
   "m": 11,
   "why": "RTO and RPO worked through with failover.",
   "yt": {
    "id": "OmASCUJEVy8",
    "ch": "ByteMonk"
   }
  },
  {
   "kind": "read",
   "req": false,
   "label": "AWS whitepaper: disaster recovery options in the cloud (the four strategies)",
   "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
   "m": 25,
   "why": "AWS's own account of the four strategies."
  }
 ],
 "lock-in": [
  {
   "kind": "read",
   "req": true,
   "label": "The Twelve-Factor App: IV, backing services",
   "url": "https://12factor.net/backing-services",
   "m": 3,
   "why": "Treat backing services as attached resources, the portable stance."
  },
  {
   "kind": "video",
   "req": false,
   "label": "Multi-cloud is a terrible idea",
   "url": "https://www.youtube.com/watch?v=Mlr7vioQqwg",
   "m": 16,
   "why": "A blunt argument that multi-cloud rarely pays.",
   "yt": {
    "id": "Mlr7vioQqwg",
    "ch": "Last Week in AWS"
   }
  },
  {
   "kind": "video",
   "req": false,
   "label": "The myth of portability: why your cloud native app is married to your provider",
   "url": "https://www.youtube.com/watch?v=cvv1cVi1n9I",
   "m": 19,
   "why": "Why portability is harder than the diagrams suggest.",
   "yt": {
    "id": "cvv1cVi1n9I",
    "ch": "CNCF [Cloud Native Computing Foundation]"
   }
  }
 ]
});

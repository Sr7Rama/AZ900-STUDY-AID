import type { QuizQuestion, Flashcard } from "@/types";

export const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    domain: "cloud-concepts",
    topic: "IaaS vs PaaS vs SaaS",
    difficulty: "beginner",
    question:
      "A startup wants to deploy a custom web application without managing the operating system, runtime, or middleware. They only want to focus on writing their application code and managing their data. Which cloud service model best fits this scenario?",
    options: [
      { id: "a", text: "Infrastructure as a Service (IaaS) — they manage everything above the hypervisor", isCorrect: false },
      { id: "b", text: "Platform as a Service (PaaS) — the provider manages the OS, runtime, and middleware", isCorrect: true },
      { id: "c", text: "Software as a Service (SaaS) — they consume a pre-built application over the internet", isCorrect: false },
      { id: "d", text: "On-premises deployment — they buy and manage their own servers", isCorrect: false },
    ],
    explanation:
      "PaaS is the correct choice because the provider manages the underlying infrastructure, operating system, runtime, and middleware. The customer only manages their application code and data. IaaS would require the customer to also manage the OS and runtime. SaaS means consuming a finished product (like Microsoft 365) with no code to deploy. On-premises means managing everything including hardware.",
    examTip:
      "Remember the shared responsibility ladder: IaaS = you manage OS + app + data. PaaS = you manage app + data only. SaaS = you manage just your data and access. The more the provider manages, the higher up the service model you go.",
  },
  {
    id: "q2",
    domain: "cloud-concepts",
    topic: "Elasticity vs Scalability",
    difficulty: "intermediate",
    question:
      "An e-commerce website experiences a traffic spike during a holiday sale and automatically provisions additional virtual machines to handle the load, then removes them when traffic returns to normal. Which cloud characteristic does this scenario best describe?",
    options: [
      { id: "a", text: "Scalability — the ability to handle increased load by adding resources permanently", isCorrect: false },
      { id: "b", text: "Elasticity — the ability to automatically add or remove resources in response to changing demand", isCorrect: true },
      { id: "c", text: "High availability — ensuring services remain accessible during failures", isCorrect: false },
      { id: "d", text: "Agility — the ability to deploy and configure resources quickly", isCorrect: false },
    ],
    explanation:
      "Elasticity is the automatic and dynamic scaling of resources in both directions — adding resources when demand increases and removing them when it decreases. Scalability is the general ability to increase capacity (e.g., adding more VMs or upgrading to a larger VM), but it doesn't necessarily imply automatic or bidirectional adjustment. The key distinction: elasticity is dynamic and automatic; scalability can be manual and is typically one-directional (up).",
    examTip:
      "Elasticity = automatic, bidirectional (scale out AND scale in based on real-time demand). Scalability = can be manual, often permanent or semi-permanent capacity increase. The cloud's pay-as-you-go model is powered by elasticity — you only pay for what you use at any given moment.",
  },
  {
    id: "q3",
    domain: "architecture-services",
    topic: "Regions vs Availability Zones",
    difficulty: "intermediate",
    question:
      "A company needs to ensure their critical application remains available even if an entire datacenter fails, but they do not need protection against a full regional outage. Which Azure redundancy option should they choose?",
    options: [
      { id: "a", text: "Deploy resources across multiple Azure regions using region pairs", isCorrect: false },
      { id: "b", text: "Deploy resources across multiple Availability Zones within the same Azure region", isCorrect: true },
      { id: "c", text: "Deploy all resources in a single datacenter within one Availability Zone", isCorrect: false },
      { id: "d", text: "Use Azure Traffic Manager to distribute traffic across global endpoints", isCorrect: false },
    ],
    explanation:
      "Availability Zones are distinct physical locations within a single Azure region, each with independent power, cooling, and networking. Deploying across two or more zones protects against datacenter-level failures while staying within one region. Region pairs protect against full regional outages (a higher level of redundancy than needed here). A single datacenter provides no redundancy. Traffic Manager is for global traffic distribution, not intra-region failover.",
    examTip:
      "Availability Zone = within one region, protects against datacenter failure (gives ~99.99% VM SLA). Region pair = across two regions, protects against regional disaster (gives ~99.99% with paired region). Zones are cheaper and simpler than multi-region for most workloads needing high availability.",
  },
  {
    id: "q4",
    domain: "architecture-services",
    topic: "Blob Storage vs Azure Files",
    difficulty: "beginner",
    question:
      "A company needs to store large amounts of unstructured data such as images, videos, and backups that will be accessed via HTTP/HTTPS REST APIs. They do not need file system mount capability. Which Azure storage service is the best choice?",
    options: [
      { id: "a", text: "Azure Blob Storage — optimized for unstructured data accessed via REST APIs", isCorrect: true },
      { id: "b", text: "Azure Files — provides SMB/NFS file shares that can be mounted by multiple VMs", isCorrect: false },
      { id: "c", text: "Azure Table Storage — a NoSQL key-value store for structured data", isCorrect: false },
      { id: "d", text: "Azure Queue Storage — for storing large numbers of messages between applications", isCorrect: false },
    ],
    explanation:
      "Azure Blob Storage is designed specifically for storing large amounts of unstructured data (binary large objects) such as images, videos, documents, and backups. It is accessed via HTTP/HTTPS REST APIs. Azure Files provides managed file shares that can be mounted as drives via SMB or NFS — useful when you need file system semantics and shared access from multiple VMs. Table Storage is for structured NoSQL data, and Queue Storage is for messaging between decoupled applications.",
    examTip:
      "Blob Storage = unstructured data (images, video, backups, logs), accessed via REST API. Azure Files = when you need an SMB/NFS file share mountable by multiple VMs. Choose Blob when you don't need a file system — it's cheaper and more scalable for object storage.",
  },
  {
    id: "q5",
    domain: "management-governance",
    topic: "Azure Policy vs RBAC",
    difficulty: "intermediate",
    question:
      "A security team wants to ensure that no virtual machines can be created in Azure regions outside of North America and Europe. Which Azure governance tool should they use to enforce this requirement at the resource creation stage?",
    options: [
      { id: "a", text: "Role-Based Access Control (RBAC) — assign roles that restrict which regions users can access", isCorrect: false },
      { id: "b", text: "Azure Policy — create a policy that denies resource creation in non-approved regions", isCorrect: true },
      { id: "c", text: "Azure Advisor — configure recommendations to warn users about non-approved regions", isCorrect: false },
      { id: "d", text: "Azure Blueprints — deploy a blueprint that only contains North American and European resources", isCorrect: false },
    ],
    explanation:
      "Azure Policy evaluates resources against defined rules and can deny non-compliant resources at creation time. A policy like 'Allowed Locations' restricts which regions resources can be deployed to. RBAC controls who can perform actions (who can create VMs), not what properties those resources must have (which regions). Azure Advisor provides recommendations but cannot enforce rules. Blueprints package policies, RBAC, and ARM templates together but are not the tool that enforces location rules — the policy within the blueprint does.",
    examTip:
      "RBAC = 'WHO can do WHAT' (identity-based permissions). Azure Policy = 'WHAT can be created and HOW' (resource compliance rules). They are complementary: RBAC controls access, Policy controls configuration. Policy can audit, deny, or remediate. RBAC cannot enforce resource properties.",
  },
  {
    id: "q6",
    domain: "management-governance",
    topic: "Cost Management alerts and budgets",
    difficulty: "beginner",
    question:
      "A finance manager wants to be notified via email when the monthly Azure spending for a specific department exceeds $5,000, so they can take action before costs spiral. Which Azure Cost Management feature should they configure?",
    options: [
      { id: "a", text: "Set up an Azure Budget with a cost alert threshold of $5,000", isCorrect: true },
      { id: "b", text: "Create an Azure Policy that denies resource creation above $5,000", isCorrect: false },
      { id: "c", text: "Configure Azure Monitor log alerts on billing-related KQL queries", isCorrect: false },
      { id: "d", text: "Enable Azure Advisor cost recommendations for the subscription", isCorrect: false },
    ],
    explanation:
      "Azure Budgets in Cost Management allow you to set spending thresholds and generate alerts when actual or forecasted costs exceed the budget. You can configure email notifications to specific recipients. Azure Policy cannot control spending levels — it enforces resource compliance rules, not cost. Azure Monitor log alerts are for application and infrastructure telemetry, not billing. Azure Advisor gives cost optimization suggestions but cannot trigger threshold-based spending alerts.",
    examTip:
      "Azure Budgets = set spending limits and get email/SMS/webhook alerts when thresholds are crossed. Budgets don't automatically stop spending — they alert you. To enforce cost limits, combine budgets with Azure Policy or automation to shut down resources. Budgets can be scoped to subscriptions, resource groups, or individual resources.",
  },
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: "f1",
    domain: "cloud-concepts",
    term: "IaaS (Infrastructure as a Service)",
    definition:
      "A cloud service model where the provider delivers virtualized computing resources — servers, storage, and networking — while the customer manages the operating system, middleware, applications, and data.",
    useCase:
      "Lifting and shifting an on-premises application to Azure Virtual Machines where you need full control over the OS and software stack.",
  },
  {
    id: "f2",
    domain: "cloud-concepts",
    term: "Elasticity",
    definition:
      "The ability of a cloud system to automatically and dynamically add or remove resources in response to real-time changes in demand — scaling out when load increases and scaling in when it decreases.",
    useCase:
      "An e-commerce site that auto-scales web server instances during a flash sale and automatically removes them when traffic normalizes, so you only pay for what you use.",
  },
  {
    id: "f3",
    domain: "architecture-services",
    term: "Availability Zone",
    definition:
      "A physically separate location within an Azure region with its own independent power, cooling, and networking, designed to protect against datacenter-level failures. Each region typically has at least three zones.",
    useCase:
      "Deploying a mission-critical VM across two Availability Zones in East US to achieve 99.99% uptime SLA and survive a single datacenter outage.",
  },
  {
    id: "f4",
    domain: "architecture-services",
    term: "Azure Blob Storage",
    definition:
      "A scalable object storage service in Azure optimized for storing large amounts of unstructured data (images, videos, documents, backups) and accessed via HTTP/HTTPS REST APIs. Does not provide file system mount capability.",
    useCase:
      "A media streaming platform storing millions of video files in Blob Storage, served to users via REST API URLs with CDN caching for fast global delivery.",
  },
  {
    id: "f5",
    domain: "management-governance",
    term: "Azure Policy",
    definition:
      "A governance service that evaluates Azure resources against business rules (policy definitions). It can audit, deny, or automatically remediate non-compliant resources at creation or update time, enforcing standards across the subscription.",
    useCase:
      "Creating a policy that denies creation of any storage account without HTTPS-only enabled, ensuring all storage traffic is encrypted in transit.",
  },
  {
    id: "f6",
    domain: "management-governance",
    term: "Azure Budget Alerts",
    definition:
      "A Cost Management feature that lets you set spending thresholds on subscriptions, resource groups, or services and receive email, SMS, or webhook notifications when actual or forecasted costs exceed the budget amount.",
    useCase:
      "Setting a $10,000/month budget on the production subscription so the DevOps team gets an email alert when spending reaches 80% of the budget.",
  },
];

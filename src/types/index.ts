export type Domain =
  | "cloud-concepts"
  | "architecture-services"
  | "management-governance";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  domain: Domain;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: QuizOption[];
  explanation: string;
  examTip: string;
}

export interface Flashcard {
  id: string;
  domain: Domain;
  term: string;
  definition: string;
  useCase: string;
}

export interface DomainStat {
  attempted: number;
  correct: number;
}

export interface QuizProgress {
  questionId: string;
  domain: Domain;
  topic: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface ProgressState {
  quizAttempts: QuizProgress[];
  bookmarks: string[];
  flashcardReview: string[];
  flashcardKnown: string[];
}

export type ViewName = "dashboard" | "quiz" | "flashcards" | "syllabus";

export type Theme = "light" | "dark";

export interface DomainMeta {
  key: Domain;
  label: string;
  weight: string;
  description: string;
  topics: string[];
}

export const DOMAINS: DomainMeta[] = [
  {
    key: "cloud-concepts",
    label: "Cloud Concepts",
    weight: "25–30%",
    description:
      "Describe cloud concepts, including the benefits of cloud computing, cloud service models (IaaS, PaaS, SaaS), consumption-based pricing, and the shared responsibility model.",
    topics: [
      "Cloud service models (IaaS, PaaS, SaaS)",
      "Public, private, and hybrid clouds",
      "Consumption-based model & pricing",
      "Shared responsibility model",
      "Cloud benefits: scalability, reliability, elasticity",
      "Capital vs. operational expenditure (CapEx/OpEx)",
    ],
  },
  {
    key: "architecture-services",
    label: "Azure Architecture & Services",
    weight: "35–40%",
    description:
      "Describe Azure core architectural components, compute and networking services, storage options, and identity & access through Microsoft Entra ID.",
    topics: [
      "Regions, Availability Zones, and resource groups",
      "Virtual Machines & ARM templates",
      "Azure App Service & Azure Functions",
      "Azure Storage accounts & redundancy (LRS, GRS)",
      "Azure Virtual Network & subnets",
      "Microsoft Entra ID (formerly Azure AD)",
      "Azure Key Vault & Managed Identities",
    ],
  },
  {
    key: "management-governance",
    label: "Azure Management & Governance",
    weight: "30–35%",
    description:
      "Describe cost management, service-level agreements, monitoring tools, and Azure governance features including policies, RBAC, and the Well-Architected Framework.",
    topics: [
      "Azure Policy & Blueprints",
      "Role-Based Access Control (RBAC)",
      "Azure Cost Management & Tags",
      "Azure Monitor & Log Analytics",
      "Service Level Agreements (SLAs)",
      "Well-Architected Framework pillars",
      "Azure Advisor & Service Health",
    ],
  },
];

export const DOMAIN_LABELS: Record<Domain, string> = {
  "cloud-concepts": "Cloud Concepts",
  "architecture-services": "Architecture & Services",
  "management-governance": "Management & Governance",
};

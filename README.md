# AZ900-STUDY-AID

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-7chfbkxc)

> An interactive study and exam prep companion designed to help tech students master the Microsoft Azure Fundamentals (AZ-900) syllabus through smart quizzes, spaced-repetition flashcards, a structured study guide, and dynamic readiness analytics.

---

## Project Overview

- **Repository Name:** `AZ900-STUDY-AID`
- **Project Status:** Active Prototype
- **Target Audience:** Tech students, computer science undergraduates, and entry-level cloud enthusiasts preparing for the AZ-900 certification.
- **Credits:** Swaleh Rama
- **Live Prototype Demo:** [https://bolt.new/~/sb1-7chfbkxc](https://bolt.new/~/sb1-7chfbkxc)

---

## Problem Statement vs. Solution

### The Learner Pain Points

Preparing for the Microsoft Azure Fundamentals (AZ-900) exam presents key obstacles for students:

1. **Practice & Assessment:** Many online practice tests present simple pass/fail keys without explaining *why* an answer is correct or incorrect.
2. **Memory & Revision:** Learners struggle to retain abstract cloud terms, billing mechanics, and architecture jargon without active recall.
3. **Planning & Progress Readiness:** Students frequently feel unsure about their readiness level and struggle to pinpoint weak domains before sitting the exam.

### The Solution: AZ900-STUDY-AID

`AZ900-STUDY-AID` addresses these pain points directly with four integrated core features:

- **Smart Quiz Builder:** Topic-filtered practice sessions with instant answer validation, domain-weighted tagging, detailed "Why this is correct" explanations, and "Key Exam Tips." Questions can be bookmarked for later review.
- **Flashcard Coach:** Interactive flip-cards for rapid terminology review with self-assessment tracking ("Got It" vs. "Need Review") and a filter toggle to practice only flagged cards.
- **Study Guide:** A structured syllabus reference covering all three AZ-900 domains with weighted topic breakdowns.
- **Readiness Tracker:** A visual dashboard that aggregates performance across all three AZ-900 syllabus domains into a weighted Readiness Index Score using the formula: `(Cloud Concepts % x 0.30) + (Architecture % x 0.35) + (Governance % x 0.35)`.

---

## System Workflow

```
       ┌────────────────────────────────────────────────────────┐
       │                   Student User                         │
       └───────────────────────────┬────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │   Readiness Dashboard   │    │     Study Guide        │
       │  (Weighted Index Score) │    │  (Syllabus Reference)  │
       └───────────┬────────────┘    └────────────────────────┘
                   │
         ┌─────────┴──────────┐
         ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ Practice Quiz    │  │ Flashcard Coach  │
│ (Smart Engine)   │  │ (Recall System)  │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └───────────┬─────────┘
                     ▼
         ┌──────────────────────┐
         │ State & LocalStorage │
         │ (Persistent Analytics)│
         └──────────────────────┘
```

1. **Onboarding & Analytics:** The student lands on the **Readiness Dashboard**, viewing a weighted readiness score across Cloud Concepts, Architecture, and Governance domains.
2. **Interactive Practice:** The user launches the **Smart Quiz Builder** or **Flashcard Coach** to test knowledge on target domains.
3. **Instant Feedback Loop:** Selecting an answer instantly updates progress scores and triggers rich explanations with clearly separated "Why this is correct" and "Key Exam Tip" sections.
4. **Weak-Area Focus:** The dashboard identifies the lowest-scoring domain and offers a one-click "Start Weak-Area Practice" button.
5. **State Persistence:** All scores, bookmarked questions, and flashcard review flags are stored locally to track growth across sessions.

---

## Architecture & System Design

`AZ900-STUDY-AID` is engineered as a lightweight Single Page Application (SPA) designed for rapid client-side performance, responsive mobile UX, and zero server management overhead during the prototype phase.

- **Frontend Framework:** React 18 + Vite for fast build cycles and modular state management.
- **Language:** TypeScript for type-safe development.
- **Styling & UI:** Tailwind CSS for responsive styling, combined with Lucide React icons for visual cues.
- **State & Persistence:** React hooks + Browser `localStorage` for offline state retention without database lock-in.

### Architectural Rationale & Trade-off Acceptance

| Architectural Choice | Rationale | Known Trade-off | Trade-off Acceptance |
| :--- | :--- | :--- | :--- |
| **Client-Side Data Storage (`localStorage`)** | Eliminates external database complexity; works offline and provides instant speed for prototype evaluation. | User progress is limited to a single browser session/device; data cleared if browser cache resets. | **Accepted:** Ideal for rapid prototyping and no-auth user testing. Multi-device sync can be added with Supabase in v2. |
| **Single Page Bundle Architecture** | Accelerates deployment and prevents build configuration issues. | Component tree density increases within single modules as features scale up. | **Accepted:** Maintains quick initial load times and rapid iteration. |
| **Weighted Readiness Scoring** | Reflects actual AZ-900 exam domain weights for more accurate readiness assessment. | Domains with no attempt data are excluded from the calculation, which can skew early scores. | **Accepted:** Score normalizes by weight of domains with data; resolves as the user attempts more questions. |

---

## Project Structure

```text
AZ900-STUDY-AID/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Header navigation & branding
│   │   ├── Dashboard.tsx       # Weighted readiness tracker & domain breakdown
│   │   ├── QuizModule.tsx      # Smart quiz builder with instant feedback & bookmarks
│   │   ├── FlashcardModule.tsx # Spaced-repetition flashcards with review filtering
│   │   ├── SyllabusGuide.tsx   # AZ-900 study guide & syllabus reference
│   │   └── Footer.tsx          # Footer with reset progress action
│   ├── data/
│   │   └── sampleData.ts       # AZ-900 practice questions & flashcard datasets
│   ├── hooks/
│   │   ├── useProgress.ts       # Progress tracking, weighted scoring & streak logic
│   │   └── useTheme.ts         # Dark/light theme management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Master application controller & view routing
│   ├── index.css               # Tailwind CSS directives
│   └── main.tsx                # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Readiness Index Formula

The Readiness Index Score uses a weighted average that mirrors the AZ-900 exam's domain distribution:

| Domain | Weight |
| :--- | :--- |
| Cloud Concepts | 30% |
| Azure Architecture & Services | 35% |
| Management & Governance | 35% |

**Formula:** `Score = (Cloud Concepts accuracy x 0.30 + Architecture accuracy x 0.35 + Governance accuracy x 0.35) / (sum of weights for domains with data)`

Status badges update based on the weighted score:

| Score Range | Status Badge |
| :--- | :--- |
| 80% and above | Exam Ready |
| 60% – 79% | On Track |
| Below 60% | Needs Practice |

---

## Local Setup & Running the Project

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/SwalehRama/AZ900-STUDY-AID.git

# 2. Navigate to the project directory
cd AZ900-STUDY-AID

# 3. Install project dependencies
npm install

# 4. Start the local Vite development server
npm run dev
```

Once the dev server starts, open your browser and navigate to `http://localhost:5173` to view the running prototype.

### Demo Walkthrough

1. Open the application and review the **Readiness Index** gauge on the Dashboard.
2. Click **Start Weak-Area Practice** to launch a quiz focused on your lowest-scoring domain.
3. Answer a question and note the clearly separated **"Why this is correct"** explanation and **"Key Exam Tip"** sections. Bookmark the question using the flag icon.
4. Switch to **Flashcards**, click a card to flip it, and mark it as **"Need Review."** Toggle the filter to show only flagged cards.
5. Navigate to **Study Guide** to review the AZ-900 syllabus topics and weights.

---

## Contribution Guidelines

Contributions are welcome from the developer community! To contribute:

1. **Fork the Repository:** Create your own copy of the repo on GitHub.
2. **Create a Feature Branch:** `git checkout -b feature/amazing-new-feature`
3. **Commit Your Changes:** `git commit -m 'Add new AZ-900 practice domain'`
4. **Push to Your Branch:** `git push origin feature/amazing-new-feature`
5. **Open a Pull Request:** Submit your PR against the `main` branch for review.

### Discussions & Inquiries

- **GitHub Discussions:** General feature requests, bug reporting, and PR feedback should be submitted via GitHub Issues and Pull Requests.
- **Direct Email Contact:** Critical inquiries or collaboration ideas can be emailed directly to **[rmswaleh1@gmail.com](mailto:rmswaleh1@gmail.com)**.

---

## License

This project was developed as a prototype for AZ-900 exam preparation. Add an appropriate license before using or distributing the project beyond its intended prototype scope.

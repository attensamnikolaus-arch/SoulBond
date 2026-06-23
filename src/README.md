<div align="center">

# 🐾 SoulBond

### *Where every shelter animal finds their community*

**A virtual & physical adoption platform that connects shelter animals with caring individuals — providing real-time impact tracking, personalized updates, and a pathway to forever homes.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Base44](https://img.shields.io/badge/Base44-BaaS-000000?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTVMMTIgMnptMCAxNUwyIDEybDEwIDUgMTAtNS0xMCA1eiIvPjwvc3ZnPg==)](https://base44.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [The Problem We Solve](#the-problem-we-solve)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Backend Functions](#backend-functions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Feature Deep Dives](#feature-deep-dives)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌟 Overview

**SoulBond** is not just another adoption website. It's a bridge between the 6.3 million animals entering US shelters each year and the millions of people who want to help but can't physically adopt. By enabling **virtual adoption** — a recurring micro-donation model — SoulBond creates a community of supporters around every animal, ensuring no shelter animal is forgotten.

### What makes SoulBond different?

| Traditional Adoption Sites | SoulBond |
|---|---|
| Browse → Apply → Maybe Adopt | Browse → Bond → Follow Journey → Visit → Adopt |
| One adopter per animal | **Multiple virtual parents** per animal — more support, more visibility |
| No ongoing relationship | Weekly/monthly photo & video updates from shelter keepers |
| Binary outcome (adopted or not) | Gradual journey: virtual bond → day out → physical adoption |
| No impact tracking | Real-time stats: lives saved, homes found, funds raised |

---

## 🐾 The Problem We Solve

Every year, **6.3 million companion animals** enter US shelters. Of those, approximately **920,000 are euthanized** — not because they're unlovable, but because shelters run out of time, space, and money.

The traditional adoption model has a fundamental limitation: **one animal, one home**. But what about the millions of people who:

- ❤️ Want to help but **can't physically adopt** (apartment restrictions, allergies, travel, family)
- 💰 Want to contribute but feel a **one-time donation is too impersonal**
- 📸 Want to **see the real impact** of their contribution
- 🏠 Are **considering adoption** but want to build a connection first

**SoulBond answers all of these.** Through virtual adoption, multiple supporters can bond with the same animal, collectively funding their care while receiving personalized updates. When someone is ready to take the next step, they can schedule a visit, take the animal for a day out, or apply for physical adoption — all within the same platform.

---

## ✨ Key Features

### 🪐 Virtual Adoption (Core Feature)
- Choose an animal and become their **virtual parent** with a monthly contribution
- Select from preset tiers ($10, $25, $50, $100) or set a custom amount
- Choose update frequency: **weekly**, **biweekly**, or **monthly**
- Multiple people can bond with the same animal — building a community of support
- **Manage your bond**: Pause, transfer to another animal, or cancel — all self-service

### 🏠 Physical Adoption
- 5-step guided adoption application with real-time validation
- Age-based guardian consent for minors (under 18 requires supervising guardian)
- Comprehensive lifestyle questionnaire (housing, household, pets, experience)
- Legal terms & liability waiver agreement
- Application status tracking (pending → approved → rejected)

### 🐕 Doggie Day Out
- Take a shelter dog for a day — give them a break from kennel life
- Multi-step application with eligibility screening
- Guardian acknowledgment for minors
- Safety requirements (own transport, no dog parks, leashed at all times)
- Liability waiver & health declaration

### 🚶 Paws in Motion (Group Dog Walking)
- Community group walking program
- Sign up for upcoming walk dates
- Experience level selection (first-time, some experience, experienced)
- Safety guidelines & requirements

### 📊 Real-Time Impact Dashboard
- Live-syncing statistics bar: lives saved, homes found, virtual parents, funds raised
- Personal dashboard showing all your bonds, updates, and visit requests
- Animal journey timeline with milestone tracking
- Update feed with photos, videos, and keeper notes

### 🏛️ Animal Profiles
- Rich, detailed profiles with rescue stories, bios, and personality tags
- Photo galleries
- Keeper's notes — personal insights from shelter staff
- Journey milestones (rescue → rehabilitation → ready for adoption)
- Physical attributes (species, breed, age, gender, weight, location)

### 💝 Donations
- One-time contributions with optional dedications
- Anonymous donation option
- Personal messages
- Preset amounts or custom

### 📅 Visit Requests
- Schedule meet-and-greets
- Day out inquiries
- Physical adoption inquiries
- Status tracking (pending → approved → completed)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | SPA with fast HMR |
| **Styling** | Tailwind CSS 3 + shadcn/ui | Design system & component library |
| **Animations** | Framer Motion | Page transitions, scroll reveals, micro-interactions |
| **Routing** | React Router v6 | Client-side routing |
| **State** | @tanstack/react-query | Server state & caching |
| **Forms** | react-hook-form | Form state management |
| **Charts** | Recharts | Impact data visualization |
| **Maps** | React-Leaflet | Shelter location maps |
| **Backend** | Base44 BaaS | Auth, database, integrations, hosting |
| **Database** | Base44 Entities (NoSQL) | Schema-driven data storage |
| **Auth** | Base44 Auth | Email/password, session management |
| **AI** | Base44 Core (InvokeLLM) | Content generation, data extraction |
| **Email** | Base44 Core (SendEmail) | Notifications & receipts |
| **File Storage** | Base44 Core (UploadFile) | Animal photos & documents |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React SPA)                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Pages   │  │Components│  │  Hooks   │  │  Lib    │ │
│  │ (9 pages)│  │ (20+ cmp)│  │(use-mobile│  │(AuthCtx)│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       └──────────────┴──────────────┴──────────────┘    │
│                          │                               │
│                    base44Client SDK                      │
└──────────────────────────┼──────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Base44 API  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────┴──────┐ ┌──────┴──────┐ ┌───────┴───────┐
   │   Entities   │ │  Functions  │ │ Integrations │
   │   (NoSQL)   │ │  (Deno)     │ │ (LLM, Email) │
   └─────────────┘ └─────────────┘ └──────────────┘
```

### Design Principles

1. **Component-first architecture** — Every UI element is a focused, reusable component (≤50 lines)
2. **Schema-driven data** — Entities define the data model; the SDK auto-generates CRUD operations
3. **Real-time by default** — Entity subscriptions push live updates to the UI
4. **Progressive engagement** — Users can start with a virtual bond and gradually move toward physical adoption
5. **Emotional design** — Warm tones, handwritten accents, and thoughtful microcopy create an emotional connection

---

## 📁 Project Structure

```
SoulBond/
├── src/
│   ├── App.jsx                    # Root component with routing & auth
│   ├── main.jsx                   # Vite entry point
│   ├── index.css                  # Design tokens & Tailwind directives
│   │
│   ├── api/
│   │   └── base44Client.js        # Pre-initialized Base44 SDK
│   │
│   ├── pages/                     # Route-level components
│   │   ├── Home.jsx               # Landing page with hero & gallery preview
│   │   ├── Gallery.jsx            # Filterable animal gallery
│   │   ├── AnimalProfile.jsx      # Individual animal detail page
│   │   ├── Dashboard.jsx          # User's bonds, updates & visit requests
│   │   ├── About.jsx              # Mission & financial transparency
│   │   ├── Donate.jsx             # One-time donation flow
│   │   ├── DayOutApplication.jsx  # Doggie Day Out multi-step form
│   │   ├── PackWalk.jsx           # Paws in Motion sign-up
│   │   └── PhysicalAdoption.jsx   # 5-step adoption application
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Layout.jsx             # Nav + footer wrapper (Outlet)
│   │   ├── HeroSection.jsx        # Full-screen hero with CTA
│   │   ├── AnimalCard.jsx         # Gallery card with hover effects
│   │   ├── StatsBar.jsx           # Live-syncing impact metrics
│   │   ├── DonationWidget.jsx     # Virtual adoption form
│   │   ├── VisitRequestForm.jsx   # Visit scheduling form
│   │   ├── AnimalJourney.jsx      # Milestone progress tracker
│   │   ├── KeeperNote.jsx         # Stylized keeper's note card
│   │   ├── ManageBondModal.jsx    # Pause/transfer/cancel bond
│   │   ├── UpdateTimeline.jsx     # Animal update feed
│   │   ├── ProtectedRoute.jsx     # Auth guard wrapper
│   │   ├── UserNotRegisteredError.jsx
│   │   └── ui/                    # shadcn/ui component library
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       └── ... (40+ components)
│   │
│   ├── entities/                  # Base44 data schemas (JSON)
│   │   ├── Animal.json
│   │   ├── VirtualAdoption.json
│   │   ├── Donation.json
│   │   ├── AnimalUpdate.json
│   │   ├── VisitRequest.json
│   │   ├── PackWalkSignup.json
│   │   ├── DayOutApplication.json
│   │   └── PhysicalAdoptionApplication.json
│   │
│   ├── functions/                 # Backend functions (Deno Deploy)
│   │   ├── createGitHubRepo.js    # GitHub repo creation via API
│   │   └── pushFilesToGitHub.js   # Batch file push via Git Data API
│   │
│   ├── lib/                       # Shared utilities
│   │   ├── AuthContext.jsx        # Auth provider & hooks
│   │   ├── query-client.js        # React Query client
│   │   ├── app-params.js          # App configuration
│   │   ├── utils.js               # cn() class merge utility
│   │   └── PageNotFound.jsx       # 404 page
│   │
│   ├── hooks/
│   │   └── use-mobile.jsx         # Mobile breakpoint hook
│   │
│   └── utils/
│       └── index.ts               # Shared utility functions
│
├── index.html                     # HTML template with meta tags
├── tailwind.config.js             # Tailwind theme configuration
├── vite.config.js                 # Vite build configuration
├── package.json                   # Dependencies & scripts
├── components.json                # shadcn/ui config
├── eslint.config.js               # ESLint rules
├── jsconfig.json                  # JS path aliases
└── README.md                      # You are here 📍
```

---

## 🗄️ Data Model

SoulBond uses 8 Base44 entities to model the entire adoption ecosystem:

### Core Entities

#### 🐾 Animal
The central entity — every shelter animal in the system.
```
name, species, breed, age, gender, location, trait, bio, rescue_story,
rescue_date, keeper_note, keeper_name, milestones[], photo_url,
gallery_urls[], adoption_status (available | virtually_adopted | physically_adopted),
virtual_adopters_count, weight, personality_tags[]
```

#### 💝 VirtualAdoption
A recurring sponsorship relationship between a donor and an animal.
```
animal_id, animal_name, donor_email, donor_name, monthly_amount,
update_frequency (weekly | biweekly | monthly),
status (active | paused | cancelled), total_donated
```

#### 🏠 PhysicalAdoptionApplication
Full adoption application with lifestyle screening.
```
animal_id, animal_name, first_name, last_name, email, phone,
address (street, city, state, zip), housing_type, own_or_rent,
landlord_allows_pets, household_adults, household_children,
current_pets, previous_pets, reason_for_adoption, hours_alone_per_day,
emergency_contact, agreed_to_terms, status (pending | approved | rejected)
```

#### 🐕 DayOutApplication
Doggie Day Out program application.
```
animal_id, animal_name, first_name, last_name, co_applicant,
address, phones, date_of_birth, preferred_date, household_members,
pets_in_household, pets_vaccinated, planned_activities, dog_housing,
can_administer_medication, has_transport, comfortable_high_energy,
energy_preference, emergency_contact, agreed_to_terms, status
```

### Supporting Entities

| Entity | Purpose | Key Fields |
|---|---|---|
| **Donation** | One-time contributions | donor_email, donor_name, amount, message, is_anonymous, dedication |
| **AnimalUpdate** | Photos/videos/stories sent to virtual parents | animal_id, title, content, photo_urls[], update_type |
| **VisitRequest** | Schedule shelter visits | animal_id, visitor_email, visit_type, preferred_date, status |
| **PackWalkSignup** | Group walking program sign-ups | full_name, email, walk_date, experience_level, status |

### Entity Relationships

```
                    ┌──────────┐
                    │  Animal  │
                    └────┬─────┘
          ┌──────────┬──┴──┬──────────┐
          │          │     │          │
          ▼          ▼     ▼          ▼
   ┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
   │ Virtual  │ │Physical│ │  Day   │ │  Visit   │
   │ Adoption │ │  Adopt │ │  Out   │ │  Request │
   └──────────┘ └────────┘ └────────┘ └──────────┘
          │
          ▼
   ┌──────────┐
   │  Animal  │
   │  Update  │
   └──────────┘
```

---

## ⚙️ Backend Functions

### `createGitHubRepo.js`
Creates a new GitHub repository via the GitHub REST API.
- **Auth**: Requires `GITHUB_TOKEN` secret
- **Input**: `repo_name`, `description`, `private`
- **Output**: `repo_url`, `clone_url`, `repo_name`

### `pushFilesToGitHub.js`
Pushes multiple files to a GitHub repository in a single commit using the Git Data API.
- **Auth**: Requires `GITHUB_TOKEN` secret
- **Input**: `files[]` (path + content), `commit_message`, `repo_name`
- **Process**: Creates blobs → tree → commit → updates ref
- **Output**: `commit_sha`, `commit_url`, `files_pushed`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- A **Base44 account** (for backend services)
- A **GitHub account** (optional — for repo creation features)

### Installation

```bash
# Clone the repository
git clone https://github.com/attensamnikolaus-arch/SoulBond.git
cd SoulBond

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### First Run

1. **Create an account** — The Base44 auth system will prompt you to register
2. **Explore the gallery** — Browse available animals at `/gallery`
3. **Bond with an animal** — Click any animal to view their profile and start a virtual adoption
4. **Check your dashboard** — Visit `/dashboard` to see your bonds and updates

---

## 🔐 Environment Variables

The following secrets are managed through the Base44 dashboard (Settings → Environment Variables):

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Optional | GitHub Personal Access Token for repo management features |
| `BASE44_APP_ID` | Auto | Pre-populated by the platform |

> ⚠️ **Security**: Never commit secrets to version control. All secrets are stored securely in the Base44 dashboard and accessed via `Deno.env.get()` in backend functions.

---

## 📜 Available Scripts

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build to /dist
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
```

---

## 🔍 Feature Deep Dives

### Virtual Adoption Flow

```
User browses gallery
    → Clicks animal card
    → Views AnimalProfile (story, gallery, journey, keeper note)
    → Opens DonationWidget
    → Selects monthly amount ($10–$100 or custom)
    → Chooses update frequency (weekly/biweekly/monthly)
    → Submits → VirtualAdoption record created
    → Animal's virtual_adopters_count incremented
    → Success message with warm, personal tone
    → Dashboard updates in real-time
```

### Bond Management

Users can manage their bonds from the Dashboard:
- **Pause** — Temporarily stop payments & updates; resumable anytime
- **Transfer** — Redirect donation to a different available animal
- **Cancel** — End the bond with a grateful farewell message

> Cancelling one person's bond does **not** affect other virtual parents of the same animal. Multiple supporters can always bond with the same animal simultaneously.

### Physical Adoption Journey (5 Steps)

```
Step 1: Choose Your Companion     → Select an animal from the gallery
Step 2: About You                 → Personal & contact information
Step 3: Your Home & Lifestyle     → Housing, household, pets, experience
Step 4: References & Agreement    → Emergency contact, terms & waiver
Step 5: Review & Submit            → Final review and submission
```

### Real-Time Impact Tracking

The `StatsBar` component subscribes to entity changes and live-updates:
- **Lives Saved** — Count of animals with `adoption_status !== 'available'`
- **Homes Found** — Count of physically adopted animals
- **Virtual Parents** — Total active VirtualAdoption records
- **Funds Raised** — Sum of all Donation amounts + VirtualAdoption totals

---

## 🎨 Design System

SoulBond uses a warm, earthy design language that evokes trust, comfort, and emotional connection.

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `background` | `hsl(40 33% 96%)` — warm cream | `hsl(138 14% 8%)` — deep forest | Page background |
| `foreground` | `hsl(138 14% 18%)` — forest green | `hsl(40 33% 96%)` — cream | Primary text |
| `primary` | `hsl(138 14% 18%)` — forest green | `hsl(40 33% 96%)` — cream | Buttons, emphasis |
| `accent` | `hsl(16 58% 56%)` — terracotta | `hsl(16 58% 56%)` — terracotta | CTAs, highlights |
| `muted` | `hsl(40 20% 92%)` — soft beige | `hsl(138 10% 16%)` — dark green | Subtle backgrounds |

### Typography

| Role | Font | Usage |
|---|---|---|
| `font-heading` | **Playfair Display** (serif) | Headlines, titles |
| `font-body` | **Inter** (sans-serif) | Body text, UI elements |
| `font-handwritten` | **Caveat** (cursive) | Keeper notes, personal touches |

### Design Tokens

All design tokens are defined in `index.css` as CSS custom properties and mapped to Tailwind classes in `tailwind.config.js`. This allows theme changes in a single location.

---

## 🗺️ Roadmap

- [ ] **Stripe Integration** — Real payment processing for donations & virtual adoptions
- [ ] **Email Notifications** — Automated update delivery via SendEmail integration
- [ ] **AI-Powered Bios** — Generate animal bios from shelter intake notes using InvokeLLM
- [ ] **Multi-Shelter Support** — Platform for multiple partner shelters
- [ ] **Mobile Apps** — iOS & Android via Base44's cross-platform publishing
- [ ] **Video Updates** — Short video clips in animal update feeds
- [ ] **Community Features** — Virtual parent forums & group chats
- [ ] **Adoption Success Stories** — Post-adoption follow-up & testimonial collection

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Follow the existing component structure (≤50 lines per component)
- Use Tailwind CSS classes — no inline styles or hardcoded colors
- Use `lucide-react` icons only
- Export every page/component as default, named same as its file
- Let errors bubble up — no try/catch unless user-facing form flows

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💛 Acknowledgments

- **Every shelter worker and volunteer** who dedicates their life to animals in need
- **The [Base44](https://base44.com) team** for the incredible BaaS platform
- **Unsplash** photographers for the beautiful animal imagery
- **shadcn/ui** for the accessible, beautiful component library
- **Every virtual parent** who chose to be part of an animal's story

---

<div align="center">

### *Together, saving one life at a time.* 🐾

**[SoulBond](https://github.com/attensamnikolaus-arch/SoulBond)** · Built with 💛 on Base44

</div>
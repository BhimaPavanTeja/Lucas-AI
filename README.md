# Lucas — Personalized Career & Skill Advisor 🚀

> **Lucas AI** is a gamified, AI-powered mentor that helps users level up their careers and skills through personalized roadmaps, project-based learning, and real-world job insights. Think: tailored learning + quests + job market intel = growth that actually matters.

## Why Lucas?
Because most learning platforms teach **stuff** — Lucas helps users *become* capable professionals. It's personalized, gamified, and pragmatic: small daily wins, projects that map to real jobs, and advice rooted in current hiring needs.


## Core principles
- **Personalization:** Every journey is unique — Lucas adapts roadmaps, quests, and resources to the user.
- **Gamification:** XP, levels, quests and streak mechanics to keep people consistent.
- **Actionable learning:** Projects > theory. Hands-on tasks drive measurable skill growth.

## User journey & workflow
1. **Onboarding**
   - Sign up, profile creation
   - Self-assess skills
   - Choose or get recommended career roadmap

2. **Skill assessment & leveling**
   - Skills use a numeric level scale:
     - Beginner: `0`
     - Intermediate: `5`
     - Advanced: `10`
     - Expert: `15-20`
   - Global profile level: `1–100` (grows via XP)

3. **Daily & weekly engagement**
   - **Job Quests:** Quick, job-relevant tasks (e.g., `Build a login form component`)
   - **Missions:** Deeper skill-based tasks (e.g., `Follow and build tutorial on Python decorators`)

4. **Progression**
   - Complete tasks → gain XP
   - Miss tasks → small XP penalty (encourages consistency)
   - Unlock perks & new content as levels increase

5. **Advanced / career switching**
   - High-level users (50–100) can unlock **Career Switch**
   - Lucas offers a seeded roadmap to pivot smoothly

## Features
- **Project-based learning**: curated real-world projects mapped to skill levels
- **Resource vault**: searchable library of curated learning resources
- **Exam & interview prep**: practice problems, mock tests, system design prompts
- **Progress tracking & analytics**: visual progress, streaks, weak-skill suggestions
- **Social / collaboration**: optional study groups, challenges, leaderboards
- **Job Insights** (see below)


## Job Insights (NEW)
Lucas provides AI-powered, personalized job-market signals so users know *what to learn* and *why*. This includes:

- **Market trends & demand**  
  - Trending roles, rising skill requirements, sector growth signals.
- **In-demand skills mapping**  
  - Skills employers list most often for roles you're targeting.
- **Personalized job recommendations**  
  - Matches based on your skills, level, and progress.

> These insights should be surfaced in the dashboard, career pages, and at the end of career roadmaps as "Market Notes".


## Tech stack & architecture
- **Frontend:** Next.js TypeScript  
- **Backend:** Node.js + TypeScript  
- **DB:** Firebase Database
- **Auth:** Firebase Authentication 
- **AI / ML:** External Google Cloud AI 
- **Storage:** Firestore 
- **Hosting:** Vercel

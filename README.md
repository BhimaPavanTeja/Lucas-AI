# Lucas AI — Personalized Career & Skill Advisor 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](#)
[![Tech Stack](https://img.shields.io/badge/stack-TS%20%7C%20Node%20%7C%20React%20%7C%20Postgres-blue.svg)](#)

> **Lucas AI** is a gamified, AI-powered mentor that helps users level up their careers and skills through personalized roadmaps, project-based learning, and real-world job insights. Think: tailored learning + quests + job market intel = growth that actually matters.

---

## Table of contents
- [Why Lucas?](#why-lucas)
- [Core principles](#core-principles)
- [User journey & workflow](#user-journey--workflow)
- [Features](#features)
- [Job Insights (new)](#job-insights-new)
- [Tech stack & architecture](#tech-stack--architecture)
- [Getting started](#getting-started)
- [Coding conventions](#coding-conventions)
- [Example types / schemas](#example-types--schemas)
- [Contributing](#contributing)
- [License](#license)

---

## Why Lucas?
Because most learning platforms teach **stuff** — Lucas helps users *become* capable professionals. It's personalized, gamified, and pragmatic: small daily wins, projects that map to real jobs, and advice rooted in current hiring needs.

---

## Core principles
- **Personalization:** Every journey is unique — Lucas adapts roadmaps, quests, and resources to the user.
- **Gamification:** XP, levels, quests and streak mechanics to keep people consistent.
- **Actionable learning:** Projects > theory. Hands-on tasks drive measurable skill growth.

---

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

---

## Features
- **Project-based learning**: curated real-world projects mapped to skill levels
- **Resource vault**: searchable library of curated learning resources
- **Exam & interview prep**: practice problems, mock tests, system design prompts
- **Progress tracking & analytics**: visual progress, streaks, weak-skill suggestions
- **Social / collaboration**: optional study groups, challenges, leaderboards
- **Job Insights** (see below)

---

## Job Insights (NEW)
Lucas provides AI-powered, personalized job-market signals so users know *what to learn* and *why*. This includes:

- **Market trends & demand**  
  - Trending roles, rising skill requirements, sector growth signals.
- **In-demand skills mapping**  
  - Skills employers list most often for roles you're targeting.
- **Personalized job recommendations**  
  - Matches based on your skills, level, and progress.
- **Role-to-roadmap conversion**  
  - Concrete roadmap suggestions that map required job skills to quests and projects.
- **Salary band guidance** *(indicative)*  
  - Typical compensation ranges for targeted roles by experience level.
- **Alerts & nudges**  
  - Notifications about new high-demand skills or certifications to consider.

> These insights should be surfaced in the dashboard, career pages, and at the end of career roadmaps as "Market Notes".

---

## Tech stack & architecture (suggested)
- **Frontend:** React (functional components), TypeScript  
- **Backend:** Node.js + TypeScript, Express (or Fastify)  
- **DB:** PostgreSQL (main), Redis (cache / sessions)  
- **Auth:** JWT / OAuth providers  
- **AI / ML:** External LLMs / embeddings for content generation & matching  
- **Storage:** S3-compatible for assets  
- **Hosting:** Vercel / Netlify (frontend), Render / Cloud run / ECS (backend)  
- **Analytics:** Postgres / Metabase for dashboards

### Example high-level flow (Mermaid)
```mermaid
flowchart LR
  A[User] --> B[Frontend (React)]
  B --> C[Backend (Node/TS)]
  C --> D[(Firebase)]
  C --> E[(Redis)]
  C --> F[AI Service]
  F --> H[Job Insights Engine]
  H --> B

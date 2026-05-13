# Dev Roast AI — `design.md`

## Product Vision

Dev Roast AI is a fun AI-powered platform that reviews developer profiles like GitHub, LinkedIn, portfolio websites, resumes, and projects with a mix of humor, roasting, and genuinely useful career feedback.

The experience should feel:

* Entertaining enough to share on social media
* Useful enough to improve hiring chances
* Casual, modern, internet-native
* Designed for students and early developers

Think:

* “Spotify Wrapped” + “Code Review”
* “LinkedIn cringe detector”
* “AI recruiter with sarcasm”

---

# Core Design Direction

## Design Personality

### Tone

* Fun
* Slightly savage
* Internet culture inspired
* Meme-aware
* Still professional enough to feel useful

### Avoid

* Corporate SaaS feeling
* Overly dark hacker aesthetic
* Excessive animations
* Too much neon cyberpunk
* Generic dashboard templates

---

# Visual Style

## Theme

### Primary Mood

Dark modern interface with playful highlights.

### Colors

#### Background

* Deep navy / charcoal
* Slight gradients
* Matte UI

#### Accent Colors

Use vibrant accents sparingly:

* Electric blue
* Purple
* Pink
* Cyan
* Lime for success
* Red/orange for roast severity

### Roast Severity Colors

| Level   | Color  |
| ------- | ------ |
| Mild    | Blue   |
| Medium  | Yellow |
| Brutal  | Orange |
| Nuclear | Red    |

---

# Typography

## Fonts

### Heading

Modern bold font:

* Space Grotesk
* Satoshi
* Clash Display

### Body

Clean readable:

* Inter
* Manrope

---

# Main UX Goal

User should:

1. Paste profile
2. Wait excitedly
3. Read funny AI roast
4. Share screenshot
5. Explore improvement suggestions
6. Come back again

The product should encourage:

* Social sharing
* Curiosity
* Competition
* Repeat usage

---

# Landing Page Structure

## 1. Hero Section

### Layout

Large centered hero.

Left:

* Big heading
* Subtext
* Input box
* CTA button

Right:

* Animated mock roast card
* Floating reactions/emojis

### Hero Copy Examples

#### Heading

“Your GitHub called. It needs help.”

Alternative:
“AI just reviewed your developer career.”

#### Subtext

“Paste your GitHub, LinkedIn, or portfolio and get roasted like a real recruiter would.”

### CTA Buttons

Primary:

* Roast Me

Secondary:

* View Demo Roast

---

# Hero Input Component

Large stylish input card.

Supports:

* GitHub username
* LinkedIn URL
* Portfolio URL
* Resume upload

### Example Placeholder

“paste your GitHub profile before recruiters do”

---

# Roast Loading Experience

This is VERY important.

## Loading Screen Ideas

### Fake AI Thoughts

Show rotating messages:

* “Detecting tutorial projects...”
* “Finding unfinished repositories...”
* “Counting copied README badges...”
* “Checking commit consistency...”
* “Looking for actual original work...”
* “Recruiter disappointment level increasing...”

### Visuals

* Animated terminal
* AI scanning effects
* Progress bar
* Roast intensity meter

Should feel entertaining, not boring.

---

# Roast Result Page

This is the core viral screen.

---

# Main Layout

## Left Section

Roast summary

## Right Section

Score cards + analytics

---

# Roast Header Card

Large dramatic score card.

## Includes

### Hireability Score

Example:
“42/100 — Recruiters are nervous.”

### Roast Level

* Mild
* Cooked
* Deep Fried
* Beyond Saving

### Share Button

Generate:

* Screenshot card
* Social share image
* Twitter/LinkedIn share

---

# Roast Categories

Each category should feel interactive and meme-worthy.

---

## 1. GitHub Activity Roast

Examples:

* “Your contribution graph looks like a heart monitor.”
* “Last meaningful commit: ancient civilization era.”
* “You start more projects than you finish.”

### Metrics

* Commit consistency
* Repo activity
* Stars
* Fork quality
* Contribution heatmap

---

## 2. README Roast

Examples:

* “Your README has more badges than actual documentation.”
* “Half the screenshots are broken.”
* “You wrote ‘AI-powered’ 17 times.”

### Metrics

* README quality
* Structure
* Documentation completeness
* Visual presentation

---

## 3. Project Quality Roast

### Detect

* Tutorial clones
* Generic CRUD apps
* Missing deployments
* Poor naming
* No real users

### Funny Examples

* “Another weather app. Revolutionary.”
* “This TODO app cured absolutely nothing.”

---

## 4. Resume/Portfolio Roast

### Detect

* Buzzword stuffing
* Poor UI
* Missing projects
* Weak descriptions
* No measurable impact

---

# Improvement Section

IMPORTANT:
Roast should end constructively.

## Section Title

“How to become employable”

### Include

* Personalized fixes
* Suggested projects
* README improvements
* Skill gaps
* Resume suggestions

---

# Smart Features

## 1. AI Career Archetype

Examples:

* Tutorial Warrior
* Hackathon Sprinter
* README Magician
* Framework Collector
* Overnight AI Expert
* StackOverflow Survivor

Users LOVE labels.

---

## 2. Developer Ranking System

### Global Leaderboard

* Most roasted
* Highest scores
* Fastest improving

### Fun Titles

* “Top 1% README survivors”
* “Commit Warrior”
* “Bug Creator Elite”

---

# Analytics Dashboard

Should look cool and slightly over-engineered.

---

# Analytics Widgets

## Usage Analytics

* Profiles analyzed
* Total roasts generated
* Average hireability score
* Daily active users

## Live Activity Feed

Real-time:

* “someone just got roasted for 42 unfinished projects”
* “another React TODO app detected”

## Share Analytics

* Most shared roast
* Viral score
* Roast trends

---

# Self Promotion Section

Needs to feel natural, not annoying.

---

# Creator Card

Small floating section.

### Includes

* Creator profile
* Portfolio
* GitHub
* LinkedIn
* “Built by developers who survived bad code reviews”

### Optional

“Hire me” CTA.

---

# Gamification

## Achievements

Examples:

* First Roast
* README Survivor
* Consistent Committer
* Open Source Human
* Actually Deploys Projects

---

# Shareable Content

This is critical for growth.

## Generate Share Cards

Beautiful exportable cards:

* Roast summary
* Score
* Funny quote
* Radar chart
* Profile avatar

Optimized for:

* Twitter/X
* LinkedIn
* Instagram story

---

# Mobile Design

Must feel app-like.

### Priorities

* Big cards
* Swipeable roast sections
* Sticky share button
* Meme-friendly screenshots

---

# Suggested UI Components

## Components

* Glassmorphism cards
* Animated progress bars
* Heatmaps
* Roast tags
* Expandable AI comments
* Floating emojis/reactions
* Gradient buttons
* Fake terminal widgets

---

# Animation Ideas

Keep smooth and subtle.

## Examples

* Cards fade upward
* Roast meter fills dramatically
* AI typing effect
* Heatmap pulse
* Score counter animation

Avoid:

* Laggy particle effects
* Excessive motion

---

# Suggested Pages

## Pages

### Public

* Landing
* Roast Result
* Demo Roast
* Leaderboard
* Pricing (future)
* About

### User

* Dashboard
* Roast History
* Saved Reports
* Shared Posts

---

# Future Premium Features

## Premium Roast

* Deep repo analysis
* AI interview simulation
* Resume rewrite
* Recruiter mode
* ATS score
* Competitive comparison

---

# Technical UI Notes For AI Agent

## Preferred Stack

* Next.js
* TailwindCSS
* Framer Motion
* shadcn/ui
* Recharts

---

# Design Constraints

## Important

* UI should NOT look like generic admin dashboard
* Prioritize personality over minimalism
* Cards should feel dynamic
* Lots of spacing
* Strong typography hierarchy
* Every section should feel screenshot-worthy

---

# Inspiration References

## Inspirations

* GitHub Wrapped
* Spotify Wrapped
* Linear
* Arc Browser
* Vercel
* Discord activity cards
* Roast-style meme pages
* Indie hacker SaaS sites

---

# Final Feel

When users open Dev Roast AI, they should feel:

> “This app is about to destroy me… but I still want to try it.”

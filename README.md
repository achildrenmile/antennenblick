# Antennenblick 📡  

[![Featured on oeradio.at](https://img.shields.io/badge/Featured_on-oeradio.at-2563eb?style=flat-square)](https://oeradio.at/werkzeuge/) [![Live Demo](https://img.shields.io/badge/Live_Demo-antennenblick.oeradio.at-16a34a?style=flat-square)](https://antennenblick.oeradio.at) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> 🎙️ **Part of the [oeradio.at](https://oeradio.at/werkzeuge/) open source ham radio tool collection.**
> Browse all tools → [**oeradio.at/werkzeuge**](https://oeradio.at/werkzeuge/)
**Antennen-Abstrahldiagramme verstehen – visuell, intuitiv, mehrsprachig**

## Idee
**Antennenblick** ist eine interaktive Webanwendung für Funkamateure, die helfen soll,  
**Antennenabstrahldiagramme zu sehen und zu verstehen**, ohne Formeln, ohne Simulationsoverkill.

Fokus:
> „Wo geht mein Signal hin – und warum?"

Die Anwendung ist **mehrsprachig**:
- 🇩🇪 **Deutsch (Default)**
- 🇬🇧 **English (Secondary language)**

Alle UI-Elemente (Menüs, Labels, Erklärtexte, Tooltips) sind vollständig lokalisiert.

---

## Claude Code Prompt

### Role
You are a senior full-stack developer and UX-focused educator with strong knowledge of amateur radio (ham radio) fundamentals, especially antenna radiation patterns and beginner education.

---

### Goal of the application
Build a **multilingual, beginner-friendly web application** that explains antenna radiation patterns visually and intuitively.

Primary language: **German**  
Secondary language: **English**

Core learning objective:
> "Help users understand where their signal goes and why antenna height, orientation, and antenna type matter more than transmit power."

---

## Target Audience
- Newly licensed radio amateurs
- Beginners with basic antenna knowledge
- No advanced math
- No expert jargon

Tone:
- Calm
- Encouraging
- Visual-first
- "Aha!" moments instead of theory dumps

---

## Core Features (MVP)

### 1. Language Support (Mandatory)
- UI language switch (Deutsch / English)
- Default language: German
- All content localized:
  - Menus
  - Buttons
  - Labels
  - Explanatory texts
  - Tooltips

Use a clean i18n approach (e.g. JSON dictionaries).

---

### 2. Antenna Selection
Predefined antennas:
- Half-wave dipole (horizontal)
- Vertical monopole (¼λ)
- Inverted-V dipole

Use simplified, **precomputed radiation patterns**  
(no real-time NEC simulation).

---

### 3. Interactive Controls
User-adjustable:
- Antenna height (e.g. 5 m / 10 m / 15 m)
- Band (40 m / 20 m)
- Orientation (azimuth rotation)

All changes update the visualization immediately.

---

### 4. Visualization
- 2D polar radiation diagram (top view)
- Optional elevation (side) view

Design principles:
- Relative field strength only
- Clear lobes and nulls
- Minimal labels
- No absolute dB values

---

### 5. Didactic Explanation Layer
For each configuration:
- Short plain-language explanation (localized):
  - "Hoher Abstrahlwinkel → gut für NVIS"
  - "Flacher Winkel → besser für DX"
- Highlight:
  - Main lobes
  - Null directions

No formulas.

---

### 6. Reality Check
Toggle:
- Ideal antenna
- Realistic setup

Realistic mode:
- Slight asymmetry
- Pattern distortion
- Short explanation:
  > "In real installations, ground, buildings, and trees influence the pattern."

---

## UX Principles
- One screen (no scrolling for MVP)
- Visual first, text second
- Every interaction teaches something
- No login, no clutter

---

## Technical Constraints
- Frontend-only (MVP)
- Modern web stack (React / Vue / Svelte)
- SVG or Canvas rendering
- No backend required

---

## Deliverables
- Component structure
- Radiation pattern rendering logic (educational, simplified)
- Example explanatory texts (DE + EN)
- Clear README explaining educational intent

---

## Explicit Non-Goals
- No professional antenna simulation
- No NEC import/export
- No exam preparation focus

---

## Success Criterion
After 10 minutes, a beginner should be able to say:
> "Jetzt verstehe ich, warum meine Antenne so funktioniert."

---

73 👋

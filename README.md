> **Language:** English · [Português (Brasil)](README.pt-BR.md)

<div align="center">

# Innovativa Inspeções SST

### Offline-friendly PWA prototype for occupational safety field checklists

**A responsive front-end prototype for organizing companies, checklist templates and SST field inspections in a single workflow.**

![PWA](https://img.shields.io/badge/PWA-20232A?style=for-the-badge&logo=pwa&logoColor=5A0FC8)
![JavaScript](https://img.shields.io/badge/JavaScript-20232A?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![HTML5](https://img.shields.io/badge/HTML5-20232A?style=for-the-badge&logo=html5&logoColor=E34F26)
![CSS3](https://img.shields.io/badge/CSS3-20232A?style=for-the-badge&logo=css3&logoColor=1572B6)

</div>

---

## What this project demonstrates

This repository contains a **sanitized portfolio edition** of the Innovativa SST field-inspection prototype. It was designed to validate the operational flow and interface before connecting production services.

The current source demonstrates:

- responsive operational dashboard;
- Técnico, Gestão and Administrador profiles;
- inspection listing, search and status filters;
- visual company and user management;
- checklist template creation, import and duplication;
- the `TERCEIROS` inspection model;
- fast **Sim / Não / N.A.** answers;
- text and photo fields;
- progress by checklist section;
- local browser persistence through `localStorage`;
- PWA manifest and service worker cache;
- separate completion progress and conformity score;
- iOS-oriented form adjustments, including the original mitigation for automatic input zoom;
- voice-input fallback guidance for browsers without Web Speech API support.

> All companies, CNPJs, users and e-mails in this public edition are synthetic demo data.

## Product flow

```text
Dashboard
   │
   ├── Inspections ──> Search / filter / status
   │                       │
   │                       └── Start field checklist
   │                                │
   │                         Section-by-section answers
   │                         Sim / Não / N.A. / text / photo
   │                                │
   │                         Progress + conformity
   │
   ├── Checklist templates
   ├── Companies
   ├── Technical agenda (prototype screen)
   └── Users and access profiles
```

## Architecture

```text
Browser / installed PWA
        │
        ├── index.html       Application shell
        ├── styles.css       Responsive UI
        ├── app.js           State + interactions + checklist flow
        ├── localStorage     Demo persistence
        ├── manifest         PWA metadata
        └── service worker   Application-shell cache
```

The v0.1 baseline is intentionally front-end focused. It does **not** claim to provide production authentication, a central API/database, audit logging or robust multi-device synchronization. Those are outside this package's implemented scope.

## Run locally

### Windows

Double-click:

```text
INICIAR_DEMO.bat
```

### Any platform with Python

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Serving through HTTP/HTTPS is required for the service worker and PWA installation behavior.

## Privacy and portfolio sanitization

The original prototype included realistic demonstration records. The public edition replaces those records with synthetic entities and reserved `example.com` e-mail addresses. No production credentials, private API endpoints or operational databases are part of this repository.

See [`PORTFOLIO_EDITION.md`](PORTFOLIO_EDITION.md) for the sanitization scope.

## Baseline

Portfolio baseline: **v0.1 / UI updates 0.1.1–0.1.2**

---

<div align="center">

Built by **Eduardo Lima** · [GitHub](https://github.com/EduSchorr)

</div>

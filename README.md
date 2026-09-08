# Anand Bora — portfolio

Personal portfolio for Anand Bora, AI Engineer at Flid AI. Built with React, TypeScript, Vite, Tailwind CSS, and the existing shadcn/ui components.

**Live:** [anand-bora.vercel.app](https://anand-bora.vercel.app/)

## Development

Use Node.js 22 and npm. The npm lockfile is the deployment source of truth.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run build
npm test
npm run lint
```

The production build runs TypeScript checks, generates the project sitemap, and creates `dist/`. GitHub Actions validates pushes and pull requests. Vercel publishes the connected `main` branch; `vercel.json` preserves direct links into the client-side routes.

## Updating content

- `src/data/profile.ts`: contact details and current experience. No inferred employment start date is published.
- `src/data/skills.ts`: current tools and the broader toolkit.
- `src/data/projects.ts`: project records, case-study content, and featured order. Existing project URLs are preserved.
- `src/index.css`: visual identity, responsive layouts, focus styles, and reduced motion.
- `public/projects/`: screenshots sourced from the corresponding public repositories.
- `public/Anand_Bora.pdf`: existing resume, preserved as supplied. Update it separately when a new resume is available.

The contact form opens a `mailto:` draft; it does not send a message or use a backend. Form content remains available if no email app opens. Themes use local device preferences through `next-themes`.

## Project screenshots

- AmEx Pulse: [project repository](https://github.com/Anand-Bora-0001/amex-pulse), `docs/dashboard.png`.
- Enterprise MLOps: [project repository](https://github.com/Anand-Bora-0001/Enterprise-MLOps-Platform), `docs/dashboard.png`.

Project descriptions distinguish prototype goals and local mocks from production capabilities. The linked repositories remain the source of truth for implementation and setup.

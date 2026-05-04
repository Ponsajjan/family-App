# Contributing to Family App

Thank you for your interest in contributing! Here's everything you need to get started.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/family-App.git
   cd family-App
   ```
3. **Set up** your environment following the [README](./README.md#getting-started)
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

```bash
npm run dev    # start the dev server at http://localhost:3000
npm run lint   # check for linting errors before committing
npm run build  # verify the production build succeeds
```

## Commit Message Convention

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add relationship editing UI
fix: correct member deletion cascade
docs: update environment variable table
refactor: extract auth helper functions
```

## Pull Request Process

1. Make sure `npm run lint` and `npm run build` pass locally
2. Update `.env.example` if you added new environment variables
3. Update `README.md` if you changed setup steps or added features
4. Include a migration (`npx prisma migrate dev`) if you changed the Prisma schema
5. Open a PR and fill in the [PR template](./.github/pull_request_template.md)

## Security

**Never commit secrets.** If you accidentally commit credentials, rotate them immediately and notify the maintainer.

If you discover a security vulnerability, please report it privately by emailing the maintainer rather than opening a public issue.

## Code Style

- TypeScript strict mode is enabled — avoid `any`
- Use Tailwind utility classes for styling (no custom CSS unless necessary)
- Keep API routes thin — move business logic into helper functions under `src/lib/`
- Prisma schema changes must include a migration

## Need Help?

Open a [GitHub Discussion](https://github.com/Ponsajjan/family-App/discussions) or file an [Issue](https://github.com/Ponsajjan/family-App/issues).

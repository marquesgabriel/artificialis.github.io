# Artificialis

[![CI](https://github.com/marquesgabriel/artificialis.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/marquesgabriel/artificialis.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/marquesgabriel/artificialis.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/marquesgabriel/artificialis.github.io/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

A parametric 3D-object customizer and STL generator, deployed at
[artificialis.marquesgabriel.com.br](https://artificialis.marquesgabriel.com.br).

Pick a printable object, tweak its numeric parameters against live validation,
preview it in an interactive 3D viewer, and download an STL ready for
slicing. Currently the catalog has one object — a **Dripper Support**, a
3D-printed adapter that mounts a coffee dripper on a bottle mouth.

## Stack

- **React 18 + TypeScript**, bundled with **Vite**
- **MUI** for the UI, **three.js** for the 3D viewer and STL export
- **Yup** for per-object parameter validation
- **i18next** for English/Portuguese localization
- **Vitest** + Testing Library for tests

## Getting started

```bash
npm install
npm start        # dev server at http://localhost:3000
```

## Scripts

| Script                 | What it does                                   |
| ---------------------- | ----------------------------------------------- |
| `npm start`             | Start the Vite dev server                       |
| `npm run build`         | Production build to `build/`                    |
| `npm run preview`       | Preview a production build locally              |
| `npm test`              | Run the test suite once                         |
| `npm run test:coverage` | Run tests with coverage (80% threshold enforced) |
| `npm run typecheck`     | Type-check with `tsc --noEmit`                  |
| `npm run lint`          | Lint with zero tolerance for warnings           |
| `npm run lint:fix`      | Lint and auto-fix                               |
| `npm run format`        | Format with Prettier                            |
| `npm run commit`        | Interactive Conventional Commits prompt         |
| `npm run deploy`        | Manual build + deploy to `gh-pages` (CI does this automatically on push to `main`) |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, pre-PR checks, commit
conventions, and branching.

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for how the printable
object catalog works, and how to add a new object.

## Support

If you find this useful, consider following on
[Instagram](https://www.instagram.com/artificialis_),
[Printables](https://www.printables.com/@artificialis), or
[buying a coffee](https://buymeacoffee.com/marquesgabriel).

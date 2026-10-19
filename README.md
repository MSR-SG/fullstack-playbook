# FullStack Playbook

This repo is my practice ground and quick reference for JavaScript, React, Java, Spring, Python and AWS.
Each topic folder holds small drills, and the `projects/` folder joins the whole stack into real apps.

## What is where

| Folder | What it holds |
|---|---|
| `cheatsheets/` | Quick help, one file per topic: aws, git, java, javascript, python, react, spring |
| `javascript/` | basics, functions-closures, async-promises, modules-es6plus |
| `react/` | Drills: components-props, hooks, context-api, routing, state-management, testing |
| `react/` (apps) | Vite apps: `login-app`, `task-manager`, `foundation/foundation-app` |
| `java/` | oop, collection, stream, lambda, concurrency, junit |
| `spring/` | core-di, rest-controllers, data-jpa, security-jwt, testing |
| `python/` | basics, data-structures, functions-modules, oop, files-json, api-fastapi, testing-pytest |
| `aws/` | iam, s3, lambda, ecs-ec2, rds-dynamodb, infra-as-code |
| `projects/` | `react-spring-app`, the end-to-end app that joins React, Spring and AWS |
| `.github/workflows/` | CI files that run the tests on each push (not written yet) |

Every drill folder has the same three parts. `README.md` holds the problem, my notes and my mistakes.
`src/` holds the code, and `test/` holds the tests that prove the code works.

## How to run things

JavaScript and React use npm. Each app has its own `node_modules` and `package-lock.json`.
The root `package.json` only holds shortcut scripts, so you can run any app from the repo root.

```bash
npm run install:all     # install every React app, run once
npm run dev:login       # start login-app
npm run dev:tasks       # start task-manager
npm run dev:foundation  # start foundation-app
npm run lint:all        # lint every app
```

You can still work inside one app folder with plain `npm install` and `npm run dev`.

Java and Spring use one Maven multi-module build, set up in the root `pom.xml`.
Each drill has its own small `pom.xml` that points Maven at `src/` and `test/`.

```bash
mvn test                       # test every Java and Spring drill
mvn -pl java/stream test       # test one drill
```

Python uses a virtual environment and pytest.

```bash
python -m venv .venv
.venv\Scripts\activate         # Windows
pip install pytest
pytest python
```

## Rules

- JavaScript and React use npm. Always commit each app's `package-lock.json`.
- Java targets version 21 and Spring Boot 4.1. Change both in the root `pom.xml` when you upgrade.
- Never commit AWS credentials. Keep them in `.env`, which `.gitignore` already blocks.

# About Me App

A single "About Me" page built from small React components. Each component gets its data through props or `children`. It puts the concepts from the [structure-of-react-app](../../foundation/structure-of-react-app/) app (props, destructuring, `children`) together into one real page.

**Stack:** React 19, Vite 8, ESLint (with `react-hooks` and `react-refresh` plugins)

## Running it

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173/
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the `dist/` build locally |
| `npm run lint` | Run ESLint over the project |

## How the app is wired

```
src/main.jsx               renders <App /> inside <StrictMode>, imports index.css
└── src/App.jsx            holds the data (name, title, skills array, contact links)
    ├── Header             name + title props
    └── .about-content
        ├── Bio            text passed as children → wrapped in <Card title="About Me">
        ├── SkillsList     skills array prop → skills.join(", ") inside <Card>
        └── ContactCard    email / github / linkedin props → links inside <Card>
```

## Components

All components are in [src/components/](src/components/):

| Component | Props | What it shows |
| --- | --- | --- |
| [Header](src/components/Header.jsx) | `name`, `title` | Page heading in a `<header>` |
| [Card](src/components/Card.jsx) | `title`, `children` | Reusable frame: a heading plus whatever is nested inside |
| [Bio](src/components/Bio.jsx) | `children` | The bio text inside a `Card` |
| [SkillsList](src/components/SkillsList.jsx) | `skills` (array) | Comma-separated skills inside a `Card` |
| [ContactCard](src/components/ContactCard.jsx) | `email`, `github`, `linkedin` | `mailto:` link and external links inside a `Card` |

## Concepts

- **One owner of data.** [App.jsx](src/App.jsx) is the only component that holds data. Everything below it is presentational: it receives props and renders them, with no state of its own.
- **Destructured props.** Every component reads its props in the parameter list, for example `function Header({ name, title })`.
- **Different prop types.** Strings (`name`, `email`), an array (`skills`) and JSX (`children`) are all passed the same way.
- **Composition with `children`.** `Card` doesn't know what it will hold. `Bio`, `SkillsList` and `ContactCard` each wrap their own content in `<Card title="...">`, so the frame is written once and reused three times.
- **Safe external links.** Links that open in a new tab use `target="_blank"` with `rel="noopener noreferrer"`, so the opened page can't reach back to this one through `window.opener`.

## Possible clean-ups

- The `.app`, `.card`, `.card-title` and `.card-content` classes are used in the JSX but not defined in [src/index.css](src/index.css), so the cards have no styling yet.
- `index.css` still has Vite template rules that nothing uses (`.counter`, `#social`, and the fixed-width `#root` layout).
- [src/App.css](src/App.css) is the Vite template stylesheet and isn't imported anywhere. It can be deleted.
- `ContactCard` still gets placeholder email, GitHub and LinkedIn values from `App.jsx`.
- `SkillsList` will crash if `skills` isn't passed. A default such as `skills = []` would make it safer.

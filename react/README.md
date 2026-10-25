# React

Hands-on React playbook for my self reference.

| Folder                                 | What it covers                                                           |
| -------------------------------------- | ------------------------------------------------------------------------ |
| [foundation/](foundation/)             | First steps: JSX, components, props, `children` (two Vite apps)          |
| [components-props/](components-props/) | Deeper look at component composition and props                           |
| [hooks/](hooks/)                       | Built-in hooks (`useState`, `useEffect`, …) and custom hooks             |
| [state-management/](state-management/) | Managing local and shared state (`useReducer`, lifting state)            |
| [context-api/](context-api/)           | Sharing data app-wide with `createContext` / `useContext`                |
| [routing/](routing/)                   | Client-side routing between pages                                        |
| [testing/](testing/)                   | Testing components                                                       |
| [login-app/](login-app/)               | Small login app: Context + `useReducer` + React Router protected route   |
| [task-manager/](task-manager/)         | Full task-manager app: `useReducer` + Context + routing + `localStorage` |

Topic folders follow a `Problem / Notes / Mistakes I made` README template, with code in `src/` and tests in `test/`.

---

## Setup Guide (Windows)

The apps need Node.js. Use NVM for Windows to install it, so you can switch Node versions per project.

### Step 1: Install and verify NVM

Install [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases) (`nvm-setup.exe`). Then open Command Prompt or PowerShell and run:

```bash
nvm version
```

You should see a version number such as `1.1.x`.

### Step 2: Install Node.js 22 LTS

```bash
nvm install 22
nvm use 22
```

Verify the installation:

```bash
node --version
npm --version
```

**Expected output:** `node --version` prints `v22.x.x` and `npm --version` prints `10.x.x` or higher.

---

## Scaffolding Guide (new React app with Vite)

### Step 1: Create the project

Open your terminal and run:

```bash
npm create vite@latest my-react-app -- --template react
```

This command will:

- Create a new folder called `my-react-app`
- Set up a React project with Vite
- Add the necessary configuration files

### Step 2: Navigate into the project

```bash
cd my-react-app
```

### Step 3: Install dependencies

```bash
npm install
```

This downloads all the required packages defined in `package.json`.

### Step 4: Start the development server

```bash
npm run dev
```

You should see output like:

```text
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open your browser and go to <http://localhost:5173/>. You should see the default Vite + React welcome page.

---

## Foundation

The folder holds one app, [foundation/structure-of-react-app/](foundation/structure-of-react-app/): one small component per concept, all rendered on one page. The same concepts are put together into a real page in the [About Me app](#about-me-app) under [Components & Props](#components--props).

### Structure of a React app

**Location:** [foundation/structure-of-react-app/](foundation/structure-of-react-app/)

**Stack:** React 19, Vite 8, ESLint (with `react-hooks` and `react-refresh` plugins)

#### Running it

```bash
cd foundation/structure-of-react-app
npm install
npm run dev       # start the dev server with hot reload
npm run build     # production build into dist/
npm run lint      # run ESLint
```

#### How the app is wired

```
index.html            <div id="root"> + loads /src/main.jsx
└── src/main.jsx      creates the React root and renders every component
    ├── Welcome            static component
    ├── App                JSX expressions + conditional rendering
    ├── UserCardWithProps  props via the `props` object   (rendered twice)
    ├── UserCardDestructured props via destructuring      (rendered twice)
    ├── Profile            props of every data type, including a function
    ├── CardWithChildren         wraps whatever JSX is nested inside it
    └── CardWithChildrenAndProp  `children` plus an optional `title` prop
```

[src/main.jsx](foundation/structure-of-react-app/src/main.jsx) is the entry point. It calls `createRoot(document.getElementById("root")).render(...)` and wraps everything in `<StrictMode>`. In development, StrictMode runs extra checks and renders components twice to surface side-effect bugs. The components are rendered one after another and separated by `<br />`. Nothing is nested inside `App`, so each component can be studied on its own.

Styling is global in [src/index.css](foundation/structure-of-react-app/src/index.css). It contains a CSS reset, the body font and colours, and a shared `.user-card` class, which is a white card with a rounded border, a shadow, and a flex column layout. All the card components use this class.

#### The components

All components are **function components**. Each one is the default export of its own file.

##### 1. `Welcome`: the simplest component

[src/Welcome.jsx](foundation/structure-of-react-app/src/Welcome.jsx)

A function that returns JSX, with no props and no logic.

```jsx
<Welcome />
```

**Concepts:** a component is just a function that returns markup. Component names must start with a capital letter. A component must return a single root element, here a `<div>`.

##### 2. `App`: JSX expressions and conditional rendering

[src/App.jsx](foundation/structure-of-react-app/src/App.jsx)

Declares local constants (string, number, boolean) and embeds them in the markup with `{curly braces}`. It shows a line only when a flag is true:

```jsx
{
  isLearningReact && <p>🎉 Currently learning React!</p>;
}
```

**Concepts:** any JavaScript expression can go inside `{}` in JSX. `condition && <JSX/>` renders the element only when the condition is truthy.

##### 3. `UserCardWithProps`: reading props from the `props` object

[src/UserCardWithProps.jsx](foundation/structure-of-react-app/src/UserCardWithProps.jsx)

Receives one `props` argument and reads `props.name`, `props.email`, and `props.age`.

```jsx
<UserCardWithProps name="Eli" email="eli@example.com" age={26} />
<UserCardWithProps name="Mel" email="mel@example.com" age={30} />
```

**Concepts:** props are how a parent passes data to a child. One component can be reused with different data. String props use quotes. Any other value (numbers, booleans, arrays, objects, functions) goes in `{}`.

##### 4. `UserCardDestructured`: the same card, destructured

[src/UserCardDestructured.jsx](foundation/structure-of-react-app/src/UserCardDestructured.jsx)

The output is identical to `UserCardWithProps`, but the props are destructured in the parameter list:

```jsx
function UserCardDestructured({ name, email, age }) { ... }
```

**Concepts:** destructuring is the idiomatic style. It shows at a glance which props a component expects, and the body stays shorter (`name` instead of `props.name`). Comparing files 3 and 4 side by side shows that the two styles are equivalent.

##### 5. `Profile`: props of every type

[src/Profile.jsx](foundation/structure-of-react-app/src/Profile.jsx)

Takes one prop of each common type. Each type is used in a different way:

| Prop       | Type     | How it's used                               |
| ---------- | -------- | ------------------------------------------- |
| `name`     | string   | rendered directly in `<h1>`                 |
| `age`      | number   | rendered directly                           |
| `isActive` | boolean  | ternary: `isActive ? "Active" : "Inactive"` |
| `hobbies`  | array    | `hobbies.join(", ")`                        |
| `address`  | object   | `address.city`, `address.country`           |
| `onClick`  | function | passed to `<button onClick={onClick}>`      |

```jsx
<Profile
  name="Rox"
  age={25}
  isActive={true}
  hobbies={["reading", "coding", "thinking"]}
  address={{ city: "Malta City", country: "Malta" }}
  onClick={() => alert("Profile clicked!")}
/>
```

**Concepts:** an object literal prop needs double braces, `{{ ... }}`. The outer pair means "JavaScript expression" and the inner pair is the object itself. Passing a function as a prop lets the **parent decide what happens** when the child's button is clicked. This is the basis of child-to-parent communication in React.

##### 6. `CardWithChildren`: the `children` prop

[src/CardWithChildren.jsx](foundation/structure-of-react-app/src/CardWithChildren.jsx)

A wrapper that renders whatever is placed between its opening and closing tags:

```jsx
function CardWithChildren({ children }) {
  return <div className="user-card">{children}</div>;
}

<CardWithChildren>
  <p>Title: Geography</p>
  <p>Instructor: Mr. Smith</p>
</CardWithChildren>
```

**Concepts:** nested JSX arrives in the special `children` prop. The card controls the frame (styling, layout) and the parent controls the content. This is **composition**, which React prefers over inheritance.

##### 7. `CardWithChildrenAndProp`: `children` plus regular props

[src/CardWithChildrenAndProp.jsx](foundation/structure-of-react-app/src/CardWithChildrenAndProp.jsx)

The same wrapper with an optional `title` prop, rendered as a heading only when it is passed:

```jsx
<CardWithChildrenAndProp title="Geography">
  <p>Instructor: Mr. Smith</p>
</CardWithChildrenAndProp>
```

**Concepts:** `children` can be combined with ordinary props. `{title && <h2>{title}</h2>}` makes the heading optional.

#### Design notes and possible clean-ups

- Each component is **presentational**: it receives data through props and renders it, with no state of its own. State comes in later topics ([hooks/](hooks/), [state-management/](state-management/)).
- `App.jsx` imports `useState` and `./App.css` but uses neither, and `App.css` is empty. These are leftovers from the Vite template.
- `Welcome.jsx` has `import React from "react"`. React 17+ no longer needs this with the new JSX transform.
- The `.app` class in `index.css` is defined but not used. Wrapping the components in `<div className="app">` in `main.jsx` would centre the page and add padding.
- `Profile` assumes `address` and `hobbies` are always passed. If either is missing it will crash. A default such as `hobbies = []` would make it safer.

---

## Components & Props

The folder holds one app, [components-props/about-me-app/](components-props/about-me-app/): the foundation concepts (props, destructuring, `children`) composed into a small "About Me" page.

### About Me app

**Location:** [components-props/about-me-app/](components-props/about-me-app/)

**Stack:** React 19, Vite 8, ESLint (with `react-hooks` and `react-refresh` plugins)

A single "About Me" page built from small components. Each one gets its data through props or `children`.

#### Running it

```bash
cd components-props/about-me-app
npm install
npm run dev
```

#### How the app is wired

```
src/main.jsx               renders <App /> inside <StrictMode>
└── src/App.jsx            holds the data (name, title, skills array, contact links)
    ├── Header             name + title props
    └── .about-content
        ├── Bio            text passed as children → wrapped in <Card title="About Me">
        ├── SkillsList     skills array prop → skills.join(", ") inside <Card>
        └── ContactCard    email / github / linkedin props → links inside <Card>
```

All components are in [src/components/](components-props/about-me-app/src/components/):

| Component | Props | What it shows |
| --- | --- | --- |
| [Header](components-props/about-me-app/src/components/Header.jsx) | `name`, `title` | Page heading in a `<header>` |
| [Card](components-props/about-me-app/src/components/Card.jsx) | `title`, `children` | Reusable frame: a heading plus whatever is nested inside |
| [Bio](components-props/about-me-app/src/components/Bio.jsx) | `children` | The bio text inside a `Card` |
| [SkillsList](components-props/about-me-app/src/components/SkillsList.jsx) | `skills` (array) | Comma-separated skills inside a `Card` |
| [ContactCard](components-props/about-me-app/src/components/ContactCard.jsx) | `email`, `github`, `linkedin` | `mailto:` link and external links (`target="_blank"` with `rel="noopener noreferrer"`) inside a `Card` |

**Concepts:** `App` is the only component that owns data. Everything below it is presentational. `Card` is a generic wrapper that the three content components reuse, which is the `children` pattern from the [structure-of-react-app](#structure-of-a-react-app) applied to a real page.

#### Design notes and possible clean-ups

- The `.app`, `.card`, `.card-title` and `.card-content` classes are used in the JSX but not defined in [src/index.css](components-props/about-me-app/src/index.css), so the cards have no styling yet. `index.css` also has an unused `.counter` rule left over from the Vite template.
- `App.css` is not imported anywhere.
- `ContactCard` still has placeholder email, GitHub and LinkedIn values.

---

## Login App

**Location:** [login-app/](login-app/)

**Stack:** React 19, Vite 8, React Router 8 (`react-router`), ESLint, Prettier

A small login flow. The user logs in with a hard-coded username and password, and only a logged-in user can open the welcome page.

### Running it

```bash
cd login-app
npm install
npm run dev            # start the dev server
npm run build          # production build into dist/
npm run lint           # run ESLint
npm run format         # format every file with Prettier
npm run format:check   # check formatting without writing
```

Log in with **`admin` / `password`**.

### How the app is wired

```
src/main.jsx                  <StrictMode> → <BrowserRouter> → <App />
└── src/App.jsx               <AuthProvider> → <AppRoutes />
    ├── /            RootRedirect     → /welcome if logged in, otherwise /login
    ├── /login       Login
    ├── (layout)     ProtectedRoute   → <Outlet /> if logged in, otherwise /login
    │   └── /welcome WelcomeMember
    └── *            redirect to /login
```

| File | Role |
| --- | --- |
| [src/context/AuthContext.jsx](login-app/src/context/AuthContext.jsx) | `AuthProvider` keeps `loggedInUser` in a `useReducer` (`LOGIN_SUCCESS`, `LOGOUT`) and exposes `{ loggedInUser, login, logout }`. The `useAuth()` hook throws if it is used outside the provider. |
| [src/components/Login.jsx](login-app/src/components/Login.jsx) | Controlled form. Its own `useReducer` holds `username`, `password` and `message`. On submit it checks for empty fields, then the credentials, and on success calls `login()` and navigates to `/welcome`. |
| [src/components/WelcomeMember.jsx](login-app/src/components/WelcomeMember.jsx) | Shows the logged-in username. **Logout** calls `logout()` and navigates back to `/login`. |
| [src/App.jsx](login-app/src/App.jsx) | Route table, plus the `RootRedirect` and `ProtectedRoute` helpers. |

**Concepts:**

- **Context + reducer** for app-wide auth state, with a custom hook (`useAuth`) as the only way to read it.
- **`useReducer` for form state**, instead of three separate `useState` calls.
- **Protected routes** with a layout route: `ProtectedRoute` renders `<Outlet />` for logged-in users and `<Navigate>` for everyone else.
- **`replace`** on `navigate()` and `<Navigate>`, so the login page doesn't stay in the browser history after logging in or out.

### Design notes and possible clean-ups

- Auth state is only in memory, so a page refresh logs the user out. Saving `loggedInUser` to `localStorage` (as [task-manager/](task-manager/) does with tasks) would keep the session.
- The credentials are hard-coded in `Login.jsx`. That's fine for practice, but a real app would call an API.
- The app `README.md` is still the default Vite template text and wrongly describes the project as TypeScript.

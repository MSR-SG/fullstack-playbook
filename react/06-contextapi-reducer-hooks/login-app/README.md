# Login App: Context API + useReducer

## First: what "state" means

**State** is just *information your app remembers while it's running*.

In this login app, the app needs to remember things like:

- what you've typed in the username box
- what you've typed in the password box
- whether you're logged in, and as who

When this remembered information changes, React redraws the screen to match it.

## Idea 1: `useReducer`, a rulebook for changing information

Think of a **bank account**.

- You can't just walk into the vault and change your balance yourself.
- You hand the teller a **slip** that says what you want, like "Deposit 50" or "Withdraw 20".
- The teller follows a **rulebook** and updates the balance.

`useReducer` works the same way:

| Bank | React | What it means |
|---|---|---|
| The balance | **state** | The information being remembered |
| The slip you fill in | **action** | A small object saying *what happened*, e.g. `{ type: 'LOGOUT' }` |
| The amount written on the slip | **payload** | Any extra data the action carries, e.g. the username |
| Handing the slip to the teller | **dispatch** | The function you call to send an action |
| The teller's rulebook | **reducer** | A function that reads the action and returns the new state |

You never change the information directly. You **dispatch** an **action** saying what happened, and the **reducer** decides the new value.

### An action (the slip)

An action is a plain object with a `type`, which is the name of what happened. It can also have a `payload`, which carries any data needed:

```js
{ type: 'SET_USERNAME', payload: 'admin' }
//  "what happened"       "the data that goes with it"
```

### dispatch (handing over the slip)

`useReducer` gives you two things back: the current state, and a `dispatch` function.

```js
const [state, dispatch] = useReducer(loginReducer, initialState)
```

Calling `dispatch(action)` hands the slip to the rulebook. React runs the reducer, stores the new state and redraws the screen.

### In this app: [Login.jsx](src/components/Login.jsx)

The login form remembers three things:

```js
const initialState = { username: '', password: '', message: '' }
```

The rulebook ([lines 8-19](src/components/Login.jsx#L8-L19)) reads like this in plain English:

- "If the slip says **SET_USERNAME**, replace the username with what's on the slip."
- "If the slip says **SET_PASSWORD**, replace the password."
- "If the slip says **SET_MESSAGE**, replace the error message."

Every time you type a letter in the username box ([line 57](src/components/Login.jsx#L57)), the app hands over a slip:

```js
dispatch({ type: 'SET_USERNAME', payload: event.target.value })
//          "what happened"          "the new text you typed"
```

The rulebook updates the username, and React redraws the box with the new text.

## Idea 2: Context API, a notice board everyone can read

Normally in React, information is passed **by hand**, from a parent component to its child, then to the grandchild, and so on. If many screens need the same information, passing it by hand gets messy.

**Context** is like a **notice board in an office hallway**. You pin information on it once, and anyone in the building can walk up and read it. Nobody has to pass notes around.

Context has three parts:

| Part | Office analogy | Code |
|---|---|---|
| Make the board | Put up an empty notice board | `createContext()` |
| Pin info on it | Post the notice | `<AuthContext.Provider value={...}>` |
| Read it | Walk up and look | `useContext()` (this app wraps it as `useAuth()`) |

Only components *inside* the Provider can read the board, the same way only people inside the building can see the hallway notice board.

## How the app combines the two

The app needs to remember **"who is logged in?"**, and three different parts of the app need that answer:

1. The **Login** screen needs to *set* it when you log in.
2. The **Welcome** screen needs to *show* the name and *clear* it on logout.
3. The **page guard** needs to *check* it, so you can't open `/welcome` without logging in.

So the app puts the logged-in user on a notice board (**Context**), and uses a rulebook (**`useReducer`**) to change it.

### Step by step in [AuthContext.jsx](src/context/AuthContext.jsx)

**1. Make the notice board** ([line 3](src/context/AuthContext.jsx#L3))

```js
const AuthContext = createContext(null)
```

**2. Write the rulebook** ([lines 7-16](src/context/AuthContext.jsx#L7-L16))

- Slip says **LOGIN_SUCCESS** → write down the username.
- Slip says **LOGOUT** → erase it.

**3. Pin it to the board** ([lines 18-29](src/context/AuthContext.jsx#L18-L29))

```js
const login  = (username) => dispatch({ type: 'LOGIN_SUCCESS', payload: username })
const logout = () => dispatch({ type: 'LOGOUT' })
```

These are two shortcut buttons, so other screens can just say `login('admin')` instead of filling in a slip by hand. The board then shows three things: **who's logged in**, the **login button** and the **logout button**.

**4. Hang the board where everyone can see it** ([App.jsx:31](src/App.jsx#L31))

```jsx
<AuthProvider>
  <AppRoutes />   ← every page is inside, so every page can read the board
</AuthProvider>
```

### Who reads the board

- **Login screen** ([Login.jsx:24](src/components/Login.jsx#L24)) grabs the `login` button. When you type `admin` / `password` and submit, it presses `login('admin')`.
- **Welcome screen** ([WelcomeMember.jsx:6](src/components/WelcomeMember.jsx#L6)) reads the name to display it, and grabs the `logout` button.
- **Page guard** ([App.jsx:11-14](src/App.jsx#L11-L14)) checks the board: "Is anyone logged in? No? Send them back to `/login`."

## The whole story of one login

1. You type `admin`. Each letter sends a slip to the **form's own rulebook**, which updates the username box.
2. You click **Login**. The app checks the password, and it's correct.
3. The Login screen presses `login('admin')`. That sends a **LOGIN_SUCCESS** slip to the **notice-board rulebook**.
4. The board now says: *logged in as admin*.
5. The app goes to `/welcome`. The guard checks the board, sees someone is logged in, and lets you through.
6. The Welcome screen reads the board and shows **"admin"**.
7. You click **Logout**. That sends a **LOGOUT** slip, and the board is erased.

## Why two rulebooks?

- **The form's typing** only matters to the Login screen, so it stays private inside [Login.jsx](src/components/Login.jsx) with no notice board.
- **Who's logged in** matters to several screens, so it goes on the notice board.

That's the main lesson of this app: **information only one screen needs stays inside that screen, and information many screens need goes in Context.**

## Hooks: the `useXXX` functions

Every function in this app whose name starts with `use` (`useReducer`, `useContext`, `useNavigate`, `useAuth`) is a **hook**.

A **hook** is a special React function that gives a component a superpower, like **remembering things** or **reading the notice board**. You can spot a hook easily because **its name always starts with `use`**.

Think of a component as a plain worker. On their own they can only draw what's on the screen. A hook is a **tool you hand them**:

- "Here's a notebook, so you can remember things." That's `useReducer`.
- "Here's a key to the hallway, so you can read the notice board." That's `useContext`.
- "Here's a map, so you can send people to another page." That's `useNavigate`.

### The hooks in this app

| Hook | Where | What it does |
|---|---|---|
| `useReducer` | [Login.jsx:22](src/components/Login.jsx#L22), [AuthContext.jsx:19](src/context/AuthContext.jsx#L19) | Remembers information and changes it with a rulebook. Gives back the current `state` and a `dispatch` function |
| `useContext` | [AuthContext.jsx:32](src/context/AuthContext.jsx#L32) | Reads what's pinned on a notice board (a Context) |
| `useNavigate` | [Login.jsx:25](src/components/Login.jsx#L25), [WelcomeMember.jsx:7](src/components/WelcomeMember.jsx#L7) | Gives a function that moves the user to another page, e.g. `navigate('/welcome')`. Comes from React Router, not React itself |
| `useAuth` | [AuthContext.jsx:31-37](src/context/AuthContext.jsx#L31-L37) | **A hook written in this app.** Reads the auth notice board and returns `loggedInUser`, `login` and `logout` |

### `useAuth`: a custom hook

React lets you **build your own hooks** by combining existing ones. These are called **custom hooks**. `useAuth` is one:

```js
export function useAuth() {
  const context = useContext(AuthContext)   // read the notice board
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

It's a shortcut. Without it, every screen would have to write:

```js
const { loggedInUser } = useContext(AuthContext)
```

With it, they just write:

```js
const { loggedInUser } = useAuth()
```

It also adds a safety check. If you use it outside the `<AuthProvider>` (outside the building), it gives a clear error instead of quietly failing.

### Two rules for using hooks

1. **Only call hooks inside a component or another hook.** You can't use them in a regular helper function.
2. **Call them at the top of the component, never inside an `if` or a loop.** React keeps track of hooks by the order they're called, so that order must be the same every time.

You can see rule 2 followed in [Login.jsx:22-25](src/components/Login.jsx#L22-L25): all four hooks sit at the top, before any `if`.

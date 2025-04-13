# 🌍 Translator Keyword Manager

A lightweight translation keyword manager built with React and TypeScript. This project allows users to manage keywords and their translations, switch between multiple language presets, and persist data locally.

---

## 📦 Features

- Add, update, and remove keywords
- Assign and edit translations for each keyword
- Multi-language support with preset loading
- Debounced auto-save to localStorage
- Drag-and-drop keyword reordering
- Clear and modular TypeScript logic
- Fast lookups using `Record<string, string>` map

---

## 🧠 Data Structure & Logic Choices

### Keywords

Stored in an array to preserve order and support reordering:

```ts
keywords = ["hello", "goodbye", "thank you"];
```

````

### Translations

Stored in an object (`Record<string, string>`) for quick access:

```ts
translations = {
  hello: "سلام",
  goodbye: "خداحافظ",
  "thank you": "متشکرم",
};
```

### Why this design?

- ✅ **Efficient Updates:** Arrays for ordered operations, objects for fast lookup/edit
- ✅ **Separation of Concerns:** Keywords and translations are logically decoupled
- ✅ **Performance Optimized:** Uses `useRef` instead of state to reduce rerenders
- ✅ **Centralized Control:** Redux-style dispatch system for keyword and translation operations
- ✅ **Persistence:** Debounced syncing to localStorage improves UX without throttling

---

## 🚀 Getting Started

### Requirements

- Node.js 18+
- npm, yarn, or pnpm

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Run Locally

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🗃 Folder Structure

```
src/
├── application/
│   ├── hooks/
│   │   ├── useTranslator.ts      # global state and logic manager
│   │   └── useDebounce.ts        # debounced logic
│   └── utils/data.ts             # preset keyword data
├── services/
│   └── storage/localStorage.ts   # localStorage wrapper
└── components/
    └── KeywordCard.tsx           # UI for individual cards
```

---

## 🧰 Dispatch System

### Keyword Actions

```ts
type Action =
  | { type: "ADD"; payload: string }
  | { type: "ADD_ALL"; list: string[] }
  | { type: "UPDATE"; index: number; payload: string }
  | { type: "REMOVE"; index: number }
  | { type: "CLEAR" }
  | { type: "MOVE"; fromIndex: number; toIndex: number };
```

### Translation Actions

```ts
type TranslationsAction =
  | { type: "ADD_ALL"; list: Record<string, string> }
  | { type: "UPDATE"; keyword: string; translation: string }
  | { type: "REMOVE"; keyword: string }
  | { type: "CLEAR" };
```

All changes trigger localStorage updates via a debounced save function.

---

## 🌐 Language Presets

- Default language is `"فارسی"`
- Supported: `["فارسی", "Français", "العربية"]`
- Preset data is preloaded and saved per language using `localStorage`

---

## 🛠 Built With

- React & TypeScript
- LocalStorage
- Custom Context & Dispatch System
````

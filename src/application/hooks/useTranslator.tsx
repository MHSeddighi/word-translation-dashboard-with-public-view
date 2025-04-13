"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import LocalStorageService from "@/src/services/storage/localStorage";
import { debounce } from "./useDebounce";
import { keywordsPreset, presets } from "../utils/data";

type Action =
  | { type: "ADD"; payload: string }
  | { type: "ADD_ALL"; list: string[] }
  | { type: "UPDATE"; index: number; payload: string }
  | { type: "REMOVE"; index: number }
  | { type: "CLEAR" }
  | { type: "MOVE"; fromIndex: number; toIndex: number }
  | { type: "SET_TRANSLATION"; keyword: string; translation: string }
  | { type: "REMOVE_TRANSLATION"; keyword: string }
  | { type: "SET_ALL_TRANSLATIONS"; translations: Record<string, string> };

type KeywordsManager = {
  add: (keyword: string, translation: string) => void;
  addAll: (data: string[]) => void;
  addFromLocalStorage: (option: string) => void;
  update: (index: number, k: string, t: string) => void;
  remove: (index: number, k: string) => void;
  removeTranslation: (k: string) => void;
  move: (from: number, to: number) => void;
  clear: () => void;
  get: () => { keyword: string; translation: string; id: string | number }[];
};

type LangsManager = {
  update: (option: string) => void;
  get: () => string[];
};

type TranslatorContextType = {
  keywordsManager: KeywordsManager;
  langsManager: LangsManager;
  updateVersion: number;
  refresh: () => void;
};

const TranslatorContext = createContext<TranslatorContextType | undefined>(
  undefined
);

export function useTranslatorContext() {
  const context = useContext(TranslatorContext);
  if (!context) {
    throw new Error(
      "useTranslatorContext must be used within a TranslatorProvider"
    );
  }
  return context;
}

export function TranslatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const keywords = useRef<string[]>([]);
  const translations = useRef<Record<string, string>>({});

  const language = useRef<{ lang: string; all: string[] }>({
    lang: "فارسی",
    all: ["فارسی", "Français", "العربية"],
  });
  const [updateVersion, forceUpdate] = useReducer((x) => x + 1, 0);

  const localStorageManager = useMemo(
    () => ({
      loadPresets: () => {
        language.current.all.forEach((item) => {
          const data = localStorage.getItem(item);
          if (!data) {
            LocalStorageService.saveAllChunks<Record<string, string>>(
              item,
              presets[item]
            );
          }
        });
        const data = localStorage.getItem("keywords");
        if (!data) {
          LocalStorageService.saveAllChunks<string[]>(
            "keywords",
            keywordsPreset
          );
        }
        LocalStorageService.get("keywords", (data) => {
          if (Array.isArray(data)) {
            dispatch({
              type: "ADD_ALL",
              list: data,
            });
            forceUpdate();
          }
        });
      },
      updateKeywords: debounce(() => {
        LocalStorageService.saveAllChunks<string[]>(
          "keywords",
          keywords.current
        );
      }, 1000),
      updateTranslations: debounce(() => {
        LocalStorageService.saveAllChunks<Record<string, string>>(
          language.current.lang,
          translations.current
        );
      }, 1000),
    }),
    [keywords]
  );

  useEffect(() => {
    localStorageManager.loadPresets();
    langsManager.update(language.current.lang);
  }, []);

  const dispatch = useCallback((action: Action) => {
    switch (action.type) {
      case "ADD":
        keywords.current.push(action.payload);
        break;
      case "ADD_ALL":
        keywords.current.push(...action.list);
        break;
      case "UPDATE":
        keywords.current[action.index] = action.payload;
        break;
      case "REMOVE":
        keywords.current.splice(action.index, 1);
        break;
      case "CLEAR":
        keywords.current.length = 0;
        break;
      case "MOVE":
        const [moved] = keywords.current.splice(action.fromIndex, 1);
        keywords.current.splice(action.toIndex, 0, moved);
        break;
    }
    localStorageManager.updateKeywords();
  }, []);

  const dispatchTranslations = useCallback((action: Action) => {
    switch (action.type) {
      case "SET_TRANSLATION":
        translations.current[action.keyword] = action.translation;
        break;
      case "REMOVE_TRANSLATION":
        delete translations.current[action.keyword];
        break;
      case "SET_ALL_TRANSLATIONS":
        Object.assign(translations.current, action.translations);
        break;
      case "CLEAR":
        translations.current = {};
        break;
    }
    localStorageManager.updateTranslations();
  }, []);

  const keywordsManager = useMemo(() => {
    return {
      add: (keyword: string) => {
        dispatch({ type: "ADD", payload: keyword });
      },
      addAll: (data: string[]) => {
        dispatch({ type: "ADD_ALL", list: data });
      },
      addFromLocalStorage: (option: string) => {
        translations.current = {};
        LocalStorageService.get(option, (data) => {
          if (data && typeof data === "object") {
            dispatchTranslations({
              type: "SET_ALL_TRANSLATIONS",
              translations: data as Record<string, string>,
            });
            forceUpdate();
          }
        });
      },
      update: (index: number, keyword: string, translation: string) => {
        dispatch({ type: "UPDATE", index: index, payload: keyword });
        dispatchTranslations({ type: "SET_TRANSLATION", keyword, translation });
      },
      remove: (index: number) => {
        dispatch({ type: "REMOVE", index: index });
        dispatchTranslations({
          type: "REMOVE_TRANSLATION",
          keyword: keywords.current[index],
        });
      },
      removeTranslation: (keyword: string) => {
        dispatchTranslations({
          type: "REMOVE_TRANSLATION",
          keyword,
        });
      },
      move: (fromIndex: number, toIndex: number) => {
        dispatch({ type: "MOVE", fromIndex, toIndex });
      },
      clear: () => {
        dispatch({ type: "CLEAR" });
        dispatchTranslations({ type: "CLEAR" });
      },
      get: () => {
        return keywords.current.map((keyword, idx) => ({
          keyword,
          translation: translations.current[keyword] || "",
          id: idx + 1,
        }));
      },
    };
  }, []);

  const langsManager = useMemo(
    () => ({
      get: () => {
        return language.current.all ?? [];
      },
      update: (option: string) => {
        language.current.lang = option;
        keywordsManager.addFromLocalStorage(option);
      },
    }),
    [keywordsManager]
  );

  return (
    <TranslatorContext.Provider
      value={{
        keywordsManager,
        langsManager,
        updateVersion,
        refresh: forceUpdate,
      }}
    >
      {children}
    </TranslatorContext.Provider>
  );
}

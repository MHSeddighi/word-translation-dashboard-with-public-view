"use client";

import { useEffect, useState } from "react";
import "./Keyword.css";
import { useTranslatorContext } from "@/src/application/hooks/useTranslator";
import {
  debounce,
  useDebouncedCallback,
} from "@/src/application/hooks/useDebounce";

interface KeywordCardProps {
  keyword: string;
  initialTranslation: string;
  id: number | string;
  index: number;
}

function DefaultKeywordCard({ keyword, initialTranslation }: KeywordCardProps) {
  return (
    <div className="border border-1 rounded-md p-4 flex flex-col justify-end">
      <h5 className="flex-grow">{keyword}</h5>
      <div className="flex-grow">
        {initialTranslation || "No translation yet"}
      </div>
    </div>
  );
}

const EditableKeywordCard = function EditableKeywordCard({
  id,
  index,
  keyword,
  initialTranslation,
}: KeywordCardProps) {
  const { keywordsManager } = useTranslatorContext();

  const [keywordState, setKeyword] = useState(keyword);
  const [translation, setTranslation] = useState(initialTranslation);

  useEffect(() => {
    setKeyword(keyword);
    setTranslation(initialTranslation);
  }, [initialTranslation, keyword]);

  const update = useDebouncedCallback((k, t) => {
    keywordsManager.update(index, k, t);
  }, 2000);

  const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newT = e.target.value;
    setTranslation(newT);
    update(keywordState, newT);
  };
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newK = e.target.value;
    setKeyword(newK);
    update(newK, translation);
  };

  const hasTranslation = translation ? true : false;

  return (
    <div className={`keyword-card`}>
      <input
        type="text"
        value={translation}
        placeholder={"...."}
        onChange={handleTranslationChange}
        className={`keyword-card__translation ${
          !hasTranslation && "keyword-card__translation--empty"
        }`}
      />
      <input
        type="text"
        value={keywordState}
        placeholder={"...."}
        onChange={handleKeywordChange}
        className={`keyword-card__title ${
          !hasTranslation && "keyword-card__title--empty"
        }`}
      />
      {/* <h3
        className={`keyword-card__title ${
          !hasTranslation && "keyword-card__title--empty"
        }`}
      >
        {keyword}
      </h3> */}
    </div>
  );
};

export { EditableKeywordCard, DefaultKeywordCard };
export type { KeywordCardProps };

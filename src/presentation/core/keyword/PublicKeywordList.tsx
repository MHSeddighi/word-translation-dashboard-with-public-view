"use client";

import { useTranslatorContext } from "@/src/application/hooks/useTranslator";
import { memo } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import { DefaultKeywordCard } from "./KeywordCard";

export default memo(function PublicKeywordList() {
  const { keywordsManager, langsManager } = useTranslatorContext();
  return (
    <div className="flex flex-col justify-between gap-4 w-full bg-background rounded-lg p-8 shadow-lg m-4 h-full">
      <div className="flex justify-between items-center w-full ">
        <Dropdown
          options={langsManager.get()}
          onChange={(o) => langsManager.update(o)}
        />
        <h4>Words Translations</h4>
      </div>

      <div className="management-keyword">
        <div className="flex flex-col justify-end gap-4">
          {keywordsManager.get().map(({ keyword, translation, id }, index) => (
            <DefaultKeywordCard
              key={id}
              keyword={keyword}
              initialTranslation={translation}
              index={index}
              id={id}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

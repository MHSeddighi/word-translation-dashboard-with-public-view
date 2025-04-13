import "./../presentation/styles/global.css";
import PublicKeywordList from "../presentation/core/keyword/PublicKeywordList";
import { TranslatorProvider } from "../application/hooks/useTranslator";

function PubicView() {
  return (
    <section className="p-4 h-screen">
      <TranslatorProvider>
        <PublicKeywordList />
      </TranslatorProvider>
    </section>
  );
}

export default PubicView;

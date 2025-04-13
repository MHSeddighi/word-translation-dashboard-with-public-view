import { TranslatorProvider } from "@/src/application/hooks/useTranslator";
import ManagementKeywordList from "@/src/presentation/core/keyword/ManagementKeywordList";

const Dashboard = () => {
  return (
    <section className="p-4 h-screen">
      <TranslatorProvider>
        <ManagementKeywordList />
      </TranslatorProvider>
    </section>
  );
};

export default Dashboard;

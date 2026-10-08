import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { StructuredData } from "./components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <Dashboard />
    </>
  );
}

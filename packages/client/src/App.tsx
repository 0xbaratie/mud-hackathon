import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";


export const App = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();

  return (
    <>
      <Header />
      <h1>文字</h1>
      <Footer />
    </>
  );
};

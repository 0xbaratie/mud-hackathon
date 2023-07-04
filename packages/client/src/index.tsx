import ReactDOM from "react-dom/client";
import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HackathonPage } from './hackathon/[address]'; 
import WalletConnection  from "./WalletConnection";
import "./index.css";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
  root.render(
    <MUDProvider value={result}>
      <Router>
        <Routes>
          <Route path="/hackathon/:address" element={<HackathonPage />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </MUDProvider>
  );
  mountDevTools();
});

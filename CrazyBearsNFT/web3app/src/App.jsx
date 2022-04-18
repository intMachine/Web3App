import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Install from "./components/Install";
import Home from "./components/Home";
import WalletBalance from "./components/WalletBalance";

// 0x5FbDB2315678afecb367f032d93F642f64180aa3
function App() {
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}

export default App;

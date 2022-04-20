import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Install from "./components/Install";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import WalletBalance from "./components/WalletBalance";
import { Nav } from "react-bootstrap";
import Marketplace from "./components/Marketplace";
import { Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import CrazyBearzz from "./artifacts/contracts/CrazyBearzz.sol/CrazyBearzz.json";
import Collection from "./components/Collection";

var contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
var provider = new ethers.providers.Web3Provider(window.ethereum);

// store this in secrets file
var operatorPrivateKey =
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// operator
var operator = new ethers.Wallet(operatorPrivateKey, provider);
console.log(operator);

// get the end user
var signer = provider.getSigner();

// get the smart contract
var contract = new ethers.Contract(contractAddress, CrazyBearzz.abi, signer);
console.log(contract);
// 0x5FbDB2315678afecb367f032d93F642f64180aa3
function App() {
  if (window.ethereum) {
    return (
      <>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="collection" element={<Collection />} />
          </Routes>
        </div>
      </>
    );
  } else {
    return <Install />;
  }
}

export { contractAddress };
export { contract, signer };
export default App;

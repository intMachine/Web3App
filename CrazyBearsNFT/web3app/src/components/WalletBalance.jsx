import { useState, useEffect } from "react";
import { ethers } from "ethers";

function WalletBalance() {
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch(
      "https://gateway.pinata.cloud/ipfs/QmXPjJb1yF6CJ64iWmw6GfjcmongHv8nLuD5D821PsoEBw/0.json"
    )
      .then((response) => response.json())
      .then((data) => setTotalReactPackages(data.total))
      .then((data) => console.log(data));

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  return (
    <div className="walletContainer ">
      <h5>Your Balance: {balance}</h5>
      <button className="btn btn-dark" onClick={() => getBalance()}>
        Show My Balance
      </button>
    </div>
  );
}

export default WalletBalance;

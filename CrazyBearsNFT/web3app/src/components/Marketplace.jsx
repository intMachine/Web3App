import { useState } from "react";
import { ethers } from "ethers";
import { contract, signer } from "../App";
//import { signer } from "./Home";

function Marketplace() {
  const [trades, setTrades] = useState([]);

  const getActiveTrades = async () => {
    const trades = await contract.getActiveTrades();
    //console.log("Active trades: ", trades.length);
    setTrades(trades);
    //for (var i = 0; i < trades.length; i++)
    //  console.log(parseInt(trades[i].index));
  };

  const getCount = async () => {
    const count = await contract.count();
    //console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const executeTrade = async (tr) => {
    try {
      await contract.executeTrade(tr.index, {
        value: ethers.utils.parseEther(parseInt(tr.price).toString()),
      });
      console.log("You bought the item!");
    } catch (err) {
      console.log(err);
    }
  };

  const cancelTrade = async (tradeId) => {
    try {
      await contract.cancelTrade(tradeId);
      console.log("You canceled the trade!");
    } catch (err) {
      console.log(err);
    }
  };

  getActiveTrades();

  return (
    <div className="container">
      <div className="row">
        {trades.map((tr) => (
          <div key={parseInt(tr.index)} className="col-md-4 nftContariner">
            <NFTImage
              tr={tr}
              executeTrade={executeTrade}
              cancelTrade={cancelTrade}
            />
          </div>
          //<h1 key={index}>index</h1>
        ))}
      </div>
    </div>
  );
}

function NFTImage({ tr, executeTrade, cancelTrade }) {
  const [cbtn, setcbtn] = useState(false);

  const getAddr = async (tr) => {
    const userAddress = await signer.getAddress();
    const posterAddress = tr.poster;
    if (userAddress == posterAddress) setcbtn(true);
  };

  const metadataURI = `ipfs://ipQmXPjJb1yF6CJ64iWmw6GfjcmongHv8nLuD5D821PsoEBw/${parseInt(
    tr.item
  )}`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/QmTi7MkQZmjV1PyeJwDAcDV1V8JMNgruutzPpKQCxTQ8BW/${parseInt(
    tr.item
  )}.png`;

  getAddr(tr);

  return (
    <div className="card">
      <img className="card-img" src={imageURI}></img>
      <div className="card-body">
        <h5 className="card-title">#{parseInt(tr.item)}</h5>
        <h6>Price: {parseInt(tr.price)} eth</h6>
        {!cbtn ? (
          <button onClick={() => executeTrade(tr)} className="btn btn-primary">
            Buy
          </button>
        ) : (
          <button
            onClick={() => cancelTrade(tr.index)}
            className="btn btn-danger"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
export default Marketplace;

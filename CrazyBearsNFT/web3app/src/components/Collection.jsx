import { contract, signer } from "../App";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function Collection() {
  const [userNfts, setuserNfts] = useState([]);

  const reverse = () => {
    toggleShow(false);
    setuserNfts([]);
  };

  const openTrade = async (tokenId, price) => {
    try {
      await contract.openTrade(tokenId, price);
      console.log("Trade published!");
    } catch (err) {
      console.log(err);
    }
  };

  const getList = async () => {
    var nfts = [];
    const price = await contract.tokensOfOwner(signer.getAddress());
    //console.log("LISTA: ", parseInt(price));

    const userAddress = await signer.getAddress();
    // console.log(userAddress)
    // get user balance
    const userBalance = parseInt((await contract.balanceOf(userAddress))._hex);
    // console.log(userBalance)
    // get nfts
    //const userNfts = [];
    for (let i = 0; i < userBalance; i++) {
      let nftId = await contract.tokenOfOwnerByIndex(userAddress, i);
      //let nftURI = await contract.tokenURI(nftId);
      nfts.push(parseInt(nftId._hex));
      //TODO: REQUEST TO URLS TO GET METADATA
    }
    toggleShow(true);
    setNumber(nfts.length);
    //console.log(nfts);
    //console.log(contract.ownerOf(0));
    //console.log(contract.ownerOf(1));
    //console.log(contract.ownerOf(2));
    //console.log(contract.ownerOf(3));
    //console.log(signer);
    setuserNfts(nfts);
  };

  const getCount = async () => {
    const count = await contract.count();
    //console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const [show, toggleShow] = useState(false);
  const [number, setNumber] = useState(0);

  getList();

  return (
    <>
      <div className="container">
        {!number ? (
          <h1>0 NFTs</h1>
        ) : (
          <div className="row">
            {userNfts.map((index) => (
              <div key={index} className="col-md-4 nftContariner">
                <NFTImage tokenId={index} openTrade={openTrade} />
              </div>
              //<h1 key={index}>index</h1>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NFTImage({ tokenId, openTrade }) {
  const [st, setst] = useState(false);
  const metadataURI = `ipfs://ipQmXPjJb1yF6CJ64iWmw6GfjcmongHv8nLuD5D821PsoEBw/${tokenId}`;

  const imageURI = `https://gateway.pinata.cloud/ipfs/QmTi7MkQZmjV1PyeJwDAcDV1V8JMNgruutzPpKQCxTQ8BW/${tokenId}.png`;

  const getStatus = async (tokenId) => {
    const status = await contract.getItemStatus(tokenId);
    setst(status);
  };

  //const status = getStatus(tokenId);
  getStatus(tokenId);
  console.log(st);

  return (
    <div className="card">
      <img className="card-img" src={imageURI}></img>
      <div className="card-body">
        <h5 className="card-title">#{tokenId}</h5>
        {!st ? (
          <button
            onClick={() => openTrade(tokenId, 1)}
            className="btn btn-success"
          >
            Sell
          </button>
        ) : (
          <button
            onClick={() => openTrade(tokenId, 1)}
            className="btn btn-danger"
          >
            On sale
          </button>
        )}
      </div>
    </div>
  );
}

export default Collection;

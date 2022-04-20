import WalletBalance from "./WalletBalance";
import Market from "./Market";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import CrazyBearzz from "../artifacts/contracts/CrazyBearzz.sol/CrazyBearzz.json";
import { contract, signer } from "../App";
import { contractAddress } from "../App";

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  console.log(contractAddress);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    //console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const [tokens, setTokens] = useState([]);

  const getNFTs = async () => {
    let lista = await contract.tokensOfOwner(signer.getAddress());
    //for(i=0;i<tokens.length;i++)
    console.log(lista);
    //setTokens(lista);
    //console.log(tokens.length);
  };

  const test = async () => {
    const userAddress = await signer.getAddress();
    const userBalance = parseInt((await contract.balanceOf(userAddress))._hex);
    console.log(userBalance);
  };

  return (
    <div className="container">
      <WalletBalance />
      <GetNFTCollection />
      <Transfer />
      <Market contract={contract} signer={signer} />
      <div className="row">
        {Array(totalMinted + 1)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="col-md-4 nftContariner">
              <NFTImage tokenId={i} getCount={getCount} />
            </div>
          ))}
      </div>
    </div>
  );
}

function GetNFTCollection() {
  //const userNfts = [];

  const reverse = () => {
    toggleShow(false);
    setuserNfts([]);
  };

  const getList = async () => {
    const price = await contract.tokensOfOwner(signer.getAddress());
    console.log("LISTA: ", parseInt(price));

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
      userNfts.push(parseInt(nftId._hex));
      //TODO: REQUEST TO URLS TO GET METADATA
    }
    toggleShow(true);
    setNumber(userNfts.length);
    console.log(userNfts);
    //console.log(contract.ownerOf(0));
    //console.log(contract.ownerOf(1));
    //console.log(contract.ownerOf(2));
    //console.log(contract.ownerOf(3));
    console.log(signer);
    setuserNfts(userNfts);
  };

  const getCount = async () => {
    const count = await contract.count();
    //console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const [show, toggleShow] = useState(false);
  const [number, setNumber] = useState(0);
  const [userNfts, setuserNfts] = useState([]);

  return (
    <>
      {!show ? (
        <div className="walletContainer">
          <button className="btn btn-dark" onClick={() => getList()}>
            Your collection
          </button>
        </div>
      ) : (
        <div>
          <div className="walletContainer">
            <button className="btn btn-dark" onClick={() => reverse()}>
              Hide
            </button>
          </div>

          {!number ? (
            <h1>0 NFTs</h1>
          ) : (
            <div className="row">
              {userNfts.map((index) => (
                <div key={index} className="col-md-4 nftContariner">
                  <NFTImage tokenId={index} getCount={getCount} />
                </div>
                //<h1 key={index}>index</h1>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function NFTImage({ tokenId, getCount }) {
  //console.log("HELLO");
  // const contentId_json = "QmQVHeMJkzZXfLno5Cz9GehojdKpGFR3iyFWnsBC4PrZ2K";
  // const contentId = "QmSFtBRaPZxgipLNgEfdo7bXep2hZ3xQRxX7DBMBDoiugx";
  //console.log(tokenId);
  //console.log(`${tokenId}`);
  const metadataURI = `ipfs://ipQmXPjJb1yF6CJ64iWmw6GfjcmongHv8nLuD5D821PsoEBw/${tokenId}`;
  //console.log(metadataURI);
  const imageURI = `https://gateway.pinata.cloud/ipfs/QmTi7MkQZmjV1PyeJwDAcDV1V8JMNgruutzPpKQCxTQ8BW/${tokenId}.png`;
  //const imageURI = `C:/Users/Stefan/Desktop/Assets/output/images/${tokenId}.png`;
  //console.log(imageURI);

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div className="card">
      <img className="card-img" src={isMinted ? imageURI : "#"}></img>
      <div className="card-body">
        <h5 className="card-title">#{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken} className="btn btn-primary">
            Mint
          </button>
        ) : (
          <button onClick={getURI} className="btn btn-primary">
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

function Transfer() {
  const [balance, setBalance] = useState();
  //console.log(contract.)
  const Transfer = async () => {
    //const connection = contract.connect(signer);
    //const addr = connection.address;
    const userAddress = signer.getAddress();
    try {
      const result = await contract.transferFrom(
        userAddress,
        "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
        0
      );
    } catch (err) {
      console.log(err);
    }

    console.log(result);
    await result.wait();
  };

  const getActiveTrades = async () => {
    const trades = await contract.getActiveTrades();
    console.log(trades);
    //setTokens(tokens);
  };

  return (
    <button
      onClick={getActiveTrades}
      className="btn btn-primary"
      //disabled={true}
      //hidden={true}
    >
      Transfer
    </button>
  );
}

export { NFTImage };
export default Home;

import WalletBalance from "./WalletBalance";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import CrazyBearzz from "../artifacts/contracts/CrazyBearzz.sol/CrazyBearzz.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, CrazyBearzz.abi, signer);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    //console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div className="container">
      <WalletBalance />
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

function NFTImage({ tokenId, getCount }) {
  // const contentId_json = "QmQVHeMJkzZXfLno5Cz9GehojdKpGFR3iyFWnsBC4PrZ2K";
  // const contentId = "QmSFtBRaPZxgipLNgEfdo7bXep2hZ3xQRxX7DBMBDoiugx";
  //console.log(tokenId);
  //console.log(`${tokenId}`);
  const metadataURI = `QmXPjJb1yF6CJ64iWmw6GfjcmongHv8nLuD5D821PsoEBw/${tokenId}.json`;
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
      <img
        className="card-img"
        src={
          isMinted
            ? imageURI
            : "C:/Users/Stefan/Documents/GitHub/generative-art-nft/output/edition CrazyBearzz/images/1.png"
        }
      ></img>
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

export default Home;

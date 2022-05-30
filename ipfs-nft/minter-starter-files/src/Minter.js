import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT, getNFTInformation } from "./utils/interact";

const Minter = (props) => {
  //State variables
  // walletAddress indicates a string that stores the user's wallet address
  const [walletAddress, setWallet] = useState("");
  // status is a string that contains a message to display at the bottom of the UI
  const [status, setStatus] = useState("");
  // name is a string that stores the NFT's name
  const [name, setName] = useState("");
  // description literally means a string that stores the NFT's description
  const [description, setDescription] = useState("");
  // url indicates a string that is a link to the NFT's digital asset
  const [url, setURL] = useState("");
 
  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
    const response = await getNFTInformation();
  }, []);

  // connectWalletPressed will be called to connect the user's Metamask wallet
  // to our dApp
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  // onMintPressed will be called to mint the user's NFT
  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus (
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;

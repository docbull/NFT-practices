require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../test-abi.json');
const contractAddress = '0x6f3f635A9762B47954229Ea479b4541eAF402A6A';

export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress,
);

export const loadCurrentMessage = async () => { 
    const message = await helloWorldContract.methods.message().call();
    return message;
};

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            )
        }
    }
};

export const getCurrentWalletConnected = async () => {
   if (window.ethereum) {
       try {
           const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                }
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                }
            }
        } catch (err) {
            return {
                address: "",status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            )
        }     
    }
};

export const updateMessage = async (address, message) => {
    if (!window.ethereum || address == null) {
        return {
            status: "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    if (message.trim() === "") {
        return {
            status: "❌ Your message cannot be an empty string.",
        }
    }

    const data = helloWorldContract.methods.update(message);
    console.log("The data:", data);

    const transactionParameters = {
        to: contractAddress,
        from: address,
        gas: Number(21000).toString(16),
        gasPrice: Number(2500000).toString(16),
        value: Number(1000000000000000000).toString(16),
        // data contains the call to our Hello World smart contract's 
        // update method, receiving our message string variable as input
        data: data.encodeABI(),
        // data: helloWorldContract.methods.update(message).encodeABI(),
    }

    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        })
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will
                    be updated automatically.
              </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        }
    }
};

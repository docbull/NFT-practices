import { pinJSONToIPFS } from './pinata.js'

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json');
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";

export const mintNFT = async (url, name, description) => {
    // error handling
    if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) {
        return {
            success: false,
            status: "❗️ Please make sure all fields are completed before minting.",
        }
    }

    // make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    // // make pinata call
    // const pinataResponse = await pinJSONToIPFS(metadata);
    // if (!pinataResponse.success) {
    //     return {
    //         success: false,
    //         status: "😥 Something went wrong while uploading your tokenURI.",
    //     }
    // }
    // const tokenURI = pinataResponse.pinataUrl;
    // console.log(tokenURI);

    const tokenURI = 'https://ipfs.io/ipfs/QmRFuoXzVCkvtgjHxHVjEgVwvbKYKhV36xmvm5ymEdkKS3'

    // // tokenURI contains following metadata:
    // // name: the name of NFT
    // // image: URI of IPFS content
    // // description: the description of the whole metadata
    // const metadataJSON = ({
    //     "name":"HI YOUTUBE",
    //     "image": "bafybeigwiw6ngj5aeqkim27xb5bpgg3pdpuk3xvwypqp3yotf6vun25jnu",
    //     "description":"This video is uploaded to https://www.youtube.com/watch?v=T17JbKs2-y4"
    // });

    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    // set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() // make call to NFT smart contract
    };

    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const connectWallet = async () => {
    if (window.ethereum) {
        const addresses = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log("MetaMask account:", addresses[0]);

        let res = await web3.eth.getTransactionReceipt("0x28c9e0064848d619e3c6369e124d4f36b72b1572a235ac8189e39746351c529b");
        console.log(res.logs[0]);
        let tokenId = web3.utils.hexToNumber(res.logs[0].topics[3]);
        console.log(tokenId);

        // res = await web3.alchemy.getNftMetadata({
        //     contractAddress: "0x4c4a07f737bf57f6632b6cab089b78f62385acae",
        //     tokenId: tokenId
        // })
        // console.log(res);
        
        let contract = new web3.eth.Contract(contractABI, "0x4c4a07f737bf57f6632b6cab089b78f62385acae");
        let owner = await contract.methods.ownerOf(tokenId).call();
        console.log(owner);

        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆 Write a message in the text-field above.",
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
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        };
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
                    status: "👆 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
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
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const getNFTInformation = async () => {
    if (window.ethereum) {
        // getting NFT metadate
        // const response = await web3.alchemy.getTokenMetadata("0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE");
        // const response = await web3.alchemy.getNftMetadata({
        //     contractAddress: "0x4c4a07f737bf57f6632b6cab089b78f62385acae",
        //     tokenId: "3709"
        // });
        const response = await web3.alchemy.getNftMetadata({
            contractAddress: "0x4c4a07f737bf57f6632b6cab089b78f62385acae",
            tokenId: "4101"
        })
        return response;
    } else {
        console.log("asdfasdf");
        return;
    }
}

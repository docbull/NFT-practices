// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.14;

// Definition of a contract that contains functions and data
// Once deployed, the contract resides at a specific address on the Ethereum blokchain
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/structure-of-a-contract.html
contract TestContract {
    // events are 
    event UpdatedMessages(string oldStr, string newStr);

    string public message;

    constructor(string memory initMessage) {
        message = initMessage;
    }

    // functions are for running smart contracts from the outsides
    function update(string memory newMessage) public {
        string memory oldMsg = message;
        message = newMessage;
        // after you emitted the event, it returns parameters as
        // an array such as: 
        /* emit UpdateMessages("Older", "Noob");
            data.returnValues
                [0] Older
                [1] Noob
         */
        emit UpdatedMessages(oldMsg, newMessage);
    }
}
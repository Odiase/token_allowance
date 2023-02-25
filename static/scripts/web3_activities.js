// global variables
let contract_address = "0x0FFAC8F7B7D84c93D1135F654Ce85BAD2105eA55";

function get_web3_object() {
    if(window.ethereum) {
        // assinging web3 object to global window.web3 variable
        window.web3 = new Web3(ethereum);
        let web3_obj = window.web3;
        return web3_obj;
    }else {
        // start_loader("");
        window.alert("Note: You do not have MetaMask or any Web3 Extensions activated, this will make this application not to behave as expected.");
    }
}


async function get_wallet(redirect_url) {
    /** Checking if a metamask extension is available and trying to access it.....of course with the user's permission */
    let web3_obj = get_web3_object();
    
    try {
        // starting loader animation
        // start_loader("Requesting Permission To Connect To Wallet, Complete the connection in the Metamask Pop-up")
         var accounts = await web3_obj.eth.requestAccounts();

         // redirects the user to the home page.
         if (accounts) {
            // showing a success message to the user and update wallet balance
            window.alert(`${accounts} Connected Successfully`)
            // show_wallet_info(accounts[0]);

            // saving the account in local storage
            localStorage.setItem('account', accounts[0]);

            // redirection
            // let current_url = window.location.href;
            // let url_to_redirect = `${location.origin}/${redirect_url}`;

            // if (current_url == url_to_redirect) {}
            // else if(redirect_url == undefined) {
            //     window.location.replace(`${location.origin}/crowd_fund/create`);
            // }
            // else{  
            //     window.location.replace(url_to_redirect);
            // }
         }
    } catch (error) {
        if (error["message"] == "Already processing eth_requestAccounts. Please wait.") {
            // start_loader("")
            window.alert("You seem to have denied access to a previous attempt to access your wallet, please clarify that.")
        }
        else{
            // start_loader("")
            window.alert("An Error Occured.")
        }
    }
}

async function is_account_connected() {
    /** Checks if a user account is connected to the application */

    let web3_obj = get_web3_object();
    
    // getting connected accounts if any
    let accounts = await web3_obj.eth.getAccounts()
    localStorage.setItem('account', accounts[0])
    if(accounts.length > 0) {
        console.log("COnnected")
        return true;
    }
    else{
        // removing stored account in local storage to get rid of errors
        localStorage.removeItem('account')
        return false
    }
}


function get_wallet_address(redirect_url){
    /** Gets the user's wallet address and if its not available, it redirects them to the 'connect wallet' page */
    if (localStorage.getItem('account')) {
        return localStorage.getItem('account');
    }
    else{
        window.location.assign("http://127.0.0.1:8000/connect_wallet");
    }
}



async function get_smart_contract(){
    let web3_obj = get_web3_object();
    let domain = location.origin;
    let contract;

    try {
        // Retrieve the ABI from the crowd_fund_factory_abi.json file
        const response = await fetch(`${domain}/static/scripts/contract_abi.json`);
        const ABI = await response.json();
    
        let contractAddress = contract_address
        // Use the ABI to define the interface of the smart contract
        contract = await new web3_obj.eth.Contract(ABI.abi, contractAddress);
        return contract;
      } 
    catch (error) {
        // start_loader("");
        console.log(error)
        window.alert("An Error Occured.")
    }
}

function gas_estimate(encoded_data) {
    // Getting Estimated Gas Fee
    let gas_estimate;
    let web3_obj = get_web3_object();

    web3_obj.eth.estimateGas({to: contract_address, data: encoded_data}, (error, estimate) => {
        if(!error) {
            gas_estimate = estimate;
        } else {
        }
    });

    return gas_estimate
}

async function withdraw_funds(address) {
    // user's address
    let user_address = get_wallet_address();

    // get smart contract
    let contract = await get_smart_contract();

    // making the transaction
    try{
        console.log(contract)
        const tx = await contract.methods.withdrawAll(address, contract_address).send({from : user_address});
        window.alert("Funds Successfully Withdrawn!")
    }
    catch(error){
        if (error.message.includes("User denied transaction signature") || error.code == 4001) {
            // start_loader("")
            window.alert("You Rejected This Transaction")
        }
        else if (error.code == 4100) {
            console.log(error)
        }
        else{
            console.log(error);
        }
    }
}

window.addEventListener("load", async () => {
    if(await is_account_connected() == false) {
        get_wallet();
    }
});

let withdraw_btns = document.querySelectorAll(".withdraw_form");

for (let i = 0; i < withdraw_btns.length; i++){
    let address = withdraw_btns[i]["address"].value;

    withdraw_btns[i].addEventListener("submit", async (e) => {
        e.preventDefault()
        withdraw_funds(address)
    })
}
// withdraw_btn.addEventListener("click", async() => {await withdraw_funds()});

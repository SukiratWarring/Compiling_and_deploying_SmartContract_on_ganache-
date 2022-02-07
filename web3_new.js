solc=require("solc");
fs=require("fs")
const Web3=require('web3')
let web3= new Web3('HTTP://127.0.0.1:7545')

//javascript part ( from fs)
let fileContent=fs.readFileSync("demo.sol").toString();

console.log(fileContent);

//input to solidity compiler
var input ={
    language: "Solidity",
    sources:{
        "demo.sol":{
            content:fileContent,
        },
    },

    settings:{
        outputSelection:{
            "*":{
                "*":["*"],
            },
        },

    },
}
//converting the output json
var output=JSON.parse(solc.compile(JSON.stringify(input)))
console.log(output)
ABI=output.contracts["demo.sol"]["demo"].abi;
bytecode=output.contracts["demo.sol"]["demo"].evm.bytecode.object
console.log("abi:",ABI)
console.log("bytecode",bytecode)
//LAST PART()

contract=new web3.eth.Contract(ABI)
let dAccount;
web3.eth.getAccounts().then((accounts)=>{
    console.log("Accounts:",accounts)
    dAccount=accounts[0];

    contract.deploy({data:bytecode})
    .send({from:dAccount,gas:500000})
    .on("receipt:",(receipt)=>{
        console.log("Contract Address:",receipt.contractAddress)
    })
    .then((demoContract)=>{
        demoContract.methods.x().call((err,data)=>{
            console.log("initial Value:",data)
        })
    })
})
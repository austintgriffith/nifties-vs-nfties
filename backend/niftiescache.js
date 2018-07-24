"use strict";
const EventParser = require('./modules/eventParser.js');
const LiveParser = require('./modules/liveParser.js');
const express = require('express');
const https = require('https');
const helmet = require('helmet');
const app = express();
const fs = require('fs');
const ContractLoader = require('./modules/contractLoader.js');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var cors = require('cors')
app.use(cors())
let contracts;
let tokens = [];
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8545'));
console.log("LOADING CONTRACTS")
contracts = ContractLoader(["Nifties","Nfties"],web3);

let Nifties = []
let Nfties = []

//my local geth node takes a while to spin up so I don't want to start parsing until I'm getting real data 
function checkForGeth() {
  contracts["Nifties"].methods.name().call({}, function(error, result){
      console.log("NAME",error,result)
      if(error){
        setTimeout(checkForGeth,15000);
      }else{
        startParsers()
      }
  });
}
checkForGeth()

function startParsers(){
  web3.eth.getBlockNumber().then((blockNumber)=>{
    console.log("=== STARTING --NIFTIES-- EVENT PARSERS AT CURRENT BLOCKNUMBER:",blockNumber,contracts["Nifties"].blockNumber)
    let updateNiftiesCreate = async (update)=>{
      console.log("NIFTIES UPDATE: "+update._id)
      if(!Nifties[update._id]) Nifties[update._id] = update
    }
    EventParser(contracts["Nifties"],"Create",contracts["Nifties"].blockNumber,blockNumber,updateNiftiesCreate);
    setInterval(()=>{
      LiveParser(contracts["Nifties"],"Create",blockNumber,updateNiftiesCreate)
    },997)

    console.log("=== STARTING --NFTIES-- EVENT PARSERS AT CURRENT BLOCKNUMBER:",blockNumber,contracts["Nfties"].blockNumber)
    let updateNftiesCreate = async (update)=>{
      console.log("NFTIES UPDATE: "+update._id)
      if(!Nfties[update._id]) Nfties[update._id] = update
    }
    EventParser(contracts["Nfties"],"Create",contracts["Nfties"].blockNumber,blockNumber,updateNftiesCreate);
    setInterval(()=>{
      LiveParser(contracts["Nfties"],"Create",blockNumber,updateNftiesCreate)
    },997)

  })

}

app.use(helmet());

app.get('/', (req, res) => {
  console.log("/")
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({cachednifties:Nifties,cachednfties:Nfties}));
});

/*
try{
  var sslOptions = {
    key: fs.readFileSync('./privkey.pem'),
    cert: fs.readFileSync('./fullchain.pem')
  }

  https.createServer(sslOptions, app).listen(9001)
  console.log(`Cryptogs api https webserver listening on 9001`);
}catch(e){
  console.log(e)
}
*/

app.listen(9002);
console.log(`http listening on 9002`);

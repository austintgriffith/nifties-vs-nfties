"use strict";
const EventParser = require('./modules/eventParser.js');
const LiveParser = require('./modules/liveParser.js');
const express = require('express');
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
const awsCreds = JSON.parse(fs.readFileSync("../aws.json").toString().trim())
const s3 = require('s3');

let Nifties = []
let Nfties = []

let writeOfflineFileDebounce

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

      if(!Nifties[update._id]) {
        console.log("NIFTIES UPDATE: "+update._id)
        Nifties[update._id] = update
        writeOfflineCache()
      }

    }
    EventParser(contracts["Nifties"],"Create",contracts["Nifties"].blockNumber,blockNumber,updateNiftiesCreate);
    setInterval(()=>{
      LiveParser(contracts["Nifties"],"Create",blockNumber,updateNiftiesCreate)
    },997)

    console.log("=== STARTING --NFTIES-- EVENT PARSERS AT CURRENT BLOCKNUMBER:",blockNumber,contracts["Nfties"].blockNumber)
    let updateNftiesCreate = async (update)=>{

      if(!Nfties[update._id]) {
        console.log("NFTIES UPDATE: "+update._id)
        Nfties[update._id] = update
        writeOfflineCache()
      }

    }
    EventParser(contracts["Nfties"],"Create",contracts["Nfties"].blockNumber,blockNumber,updateNftiesCreate);
    setInterval(()=>{
      LiveParser(contracts["Nfties"],"Create",blockNumber,updateNftiesCreate)
    },997)

  })

}

function writeOfflineCache(){
  clearTimeout(writeOfflineFileDebounce)
  writeOfflineFileDebounce = setTimeout(()=>{
    var dir = './build';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFile(dir+"/offline.js","window.offline = "+JSON.stringify({cachednifties:Nifties.slice().reverse().slice(0,25),cachednfties:Nfties.slice().reverse().slice(0,25)}),(a,b)=>{
      console.log("wrote offline.js",a,b)
      console.log("uploading offline.js to nfties.io...")
      uploadOfflineTo("nfties.io",()=>{
        console.log("uploading offline.js to nifties.io...")
        uploadOfflineTo("nifties.io",()=>{
          console.log("...done with S3 upload!")
        })
      })
    })
  },4000)
}

function uploadOfflineTo(bucket,cb){

  let client = s3.createClient({
    s3Options: awsCreds,
  });

  let params = {
    localDir: "build",
    s3Params: {
      Bucket: bucket,
      Prefix: "",
      ACL: "public-read"
    },
  };

  fs.readdir( params.localDir , function( err, files ) {
      //the deployment address needs to be here so this needs to happen from the live box!
      if( err ) {
          console.error( "Could not list the directory.", err );
          process.exit( 1 );
      }
      let uploader = client.uploadDir(params);
      uploader.on('error', function(err) {
        console.error("unable to sync:", err.stack);
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
        console.log("done uploading offline to "+bucket);
        if(typeof cb=="function") cb()
      });
  })
}

app.use(helmet());

app.get('/', (req, res) => {
  console.log("/")
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({cachednifties:Nifties.slice().reverse().slice(0,25),cachednfties:Nfties.slice().reverse().slice(0,25)}));

});


app.listen(9002);
console.log(`http listening on 9002`);

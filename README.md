# nifties-vs-nfties - NIFTY remote hack

*Should we call ERC-721 tokens Nifties or Nfties? You decide by crafting monsters with or without eyes.*

![nifties vs nfties](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/niftiesvsnfties.png)

I'm not able to attend the [NIFTY hackathon in Hong Kong](https://www.nifty.gg/), but I love to #BUIDL with NFTs so I decided to take the day off work to make a fun little project based around this poll about 👁️'s in Nifties:

![the great poll begins](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/thegreatpoll.png)

Other than the rule about physically being there, I will follow all of their [hackathon rules posted here](https://niftyhacks.devpost.com/rules) and do my best to document my process.

----

### 9:30 AM - Create React App

To prepare the repo with the correct directory structure, I'll use create react app to kick off the #BUIDL:

```
git clone https://github.com/austintgriffith/nifties-vs-nfties
cd nifties-vs-nfties
npx create-react-app .
npm i
```


### 10:00 AM - Uploaded Assets

I created the Nifties vs Nfties monsters by drawing each different piece in a different layer in Photoshop. Then, I exported each layer using [this tool](https://github.com/jwa107/Photoshop-Export-Layers-to-Files-Fast). Finally, I built [a node script](https://gist.github.com/austintgriffith/e79373979f8d47b23656464942668177) that composes all the different layers in all the different combinations to produce the static assets.

Each token consists of a different head, body, mouth, feet, etc... I wanted to make them static assets and not dynamically generate them each time. This allows me to upload them to IPFS or a similar service and not have any traditional backend.

Here is an example token *nfties-5-4-5-3-5.png* (body 5, feet 4, head 5, mouth 3, extra 5):

![nfties-5-4-5-3-5.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/tokens/nfties-5-4-5-3-5.png)

*Note: these files are too big. I already started the upload because I'm moving fast on this, but I will want to do a second pass and shrink these to about 25% their current size.*

### 10:45 AM - Carve out service worker & clean up CRA

One of the first things I do when building a Dapp is carve out the service worker from [index.js](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/index.js) because of issues you end up having down the road with web3, ssl, and android:
https://medium.com/coinmonks/react-service-worker-web3-android-98970a6691ad

I also like to strip CRA down to just the basics and get a little cleaner [App.css](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/App.css) file ready. Plus getting the favicon looking right and add in the SEO junk.

### 10:50 AM - Clevis & Zeppelin

I have my own blockchain orchestration tool called Clevis that is similar to Truffle. Building it helped me understand a lot of the underlying mechanics work so I stick to using it instead of switching to Truffle, but they can work harmoniously together if needed. Learn more about clevis here: https://github.com/austintgriffith/clevis

```
clevis init
```

We are also going to need OpenZeppelin's wonderful library of contracts to extend:

```
git clone https://github.com/OpenZeppelin/openzeppelin-solidity.git
```

### 12:10 PM - Write Nifties and Nfties Smart Contracts

The smart contracts will be fairly simple. We will want to extend the fantastic work by OpenZeppelin to create our own ERC-721s with metadata for the different parts of the NFT monsters:

```
struct Token{
  uint8 body;
  uint8 feet;
  uint8 head;
  uint8 mouth;
  uint8 extra;
  uint64 birthBlock;
}
```

I'll also be reusing some old code from my game https://galleass.io to pull uint8 random numbers from the blockhash:

```
bytes32 sudoRandomButTotallyPredictable = keccak256(abi.encodePacked(totalSupply(),blockhash(block.number - 1)));
uint8 body = (uint8(sudoRandomButTotallyPredictable[0])%5)+1;
uint8 feet = (uint8(sudoRandomButTotallyPredictable[1])%5)+1;
uint8 head = (uint8(sudoRandomButTotallyPredictable[2])%5)+1;
uint8 mouth = (uint8(sudoRandomButTotallyPredictable[3])%5)+1;
uint8 extra = (uint8(sudoRandomButTotallyPredictable[4])%5)+1;
```

Obviously, if this was somehow tied to real money it would be a very bad idea to generate randomness on-chian. I wrote an article that explains that more here: https://medium.com/coinmonks/is-block-blockhash-block-number-1-okay-14a28e40cc4b

It will take me a bit to write these smart contracts. I'll used Clevis to create, compile, deploy, and publish these contracts into my app after firing up a local testrpc:

```
ganache-cli
clevis create Nfties
clevis compile Nfties
clevis deploy Nfties 0
clevis create Nifties
clevis compile Nifties
clevis deploy Nifties 0
clevis test publish
```

All of this can be run with a single clevis command too:

```
clevis test full
```

Once the contracts are deployed to my local testnet, I can test that the create function works by calling create as account 1:

```
clevis contract create Nifties 1
```

Then, I can call get for the token with id 0:

```
clevis contract get Nifties 0
```

Neat, this returns the metadata for the monster and it looks like it did the random number generation correctly:

```
Result {
  '0': '0x173A937400860b7CdAB63c1d462B05B8426f6991',
  '1': '5',
  '2': '2',
  '3': '7',
  '4': '7',
  '5': '10',
  owner: '0x173A937400860b7CdAB63c1d462B05B8426f6991',
  body: '5',
  feet: '2',
  head: '7',
  mouth: '7',
  birthBlock: '10'
}
```

Let's also look to see that the token's URI is correct because this was the headiest part of the contract (and most gas inefficient, Solidity pros will laugh when they see my code):

```
clevis contract tokenURI Nifties 0
```

returns:

```
https://nifties.io/tokens/nifties-5-2-7-7.png
```
At this point, the above website is not up yet, but it will be by the end of this hack! Here is what that monster looks like:

![nifties-5-2-7-7.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/tokens/nifties-5-2-7-7.png)

My contracts use about 45% of all the gas just to do the string concat... it's pretty dirty, but it's a fast and loose hackathon day!

I'll do the same tests for the Nfties contract and then get the code pushed out:

```
clevis contract create NFties 2
clevis contract get Nfties 0
```

It looks good. Damn, these really came together quickly. Big thanks to OpenZeppelin and the contributors to those well curated contracts. We stand on some pretty impressive shoulders :)

Hacking these contracts up quickly reminded me of whailing away on the contracts for my game Cryptogs.io in the hotel room at #EthDenver. Here is one of the more interesting commits from that night: https://github.com/austintgriffith/cryptogs/commit/4cada47cbb18a8a27221b10b38ccb98ad80f5006

### 12:45 PM - Dapparat.us: Metamask

After participating in a few hackathons and building out a couple blockchain games, I found that I was reusing a lot of the same React components. Everything from the simple account display to event parsing to transactions UI/UX.

I wouldn't be able to build this project out so quickly without my NPM package called [Dapparatus](https://www.npmjs.com/package/dapparatus). There will also, no doubt, be some commits to this repo throughout the day too. It is evolving quickly:
https://github.com/austintgriffith/dapparatus

Let's bring in the package and start building out our frontend to talk to our contracts:

```
npm install --save dapparatus
```

In the App.js I'll bring in all the Dapparatus components:

```
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler } from "dapparatus"
```

The Metamask object is the first and most important. It watches for the injected web3 provider and ships updates to your main app as blocks, balances, etc change:

```
<Metamask
  onUpdate={(state)=>{
    console.log("metamask state update:",state)
    if(state.web3Provider) {
      state.web3 = new Web3(state.web3Provider)
      this.setState(state)
    }
  }}
/>
```

![metamask.gif](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/metamask.gif)


This component is also the most configurable and all the options can be found here: https://github.com/austintgriffith/dapparatus/blob/master/src/metamask.js

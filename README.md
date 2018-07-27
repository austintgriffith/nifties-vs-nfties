# nifties-vs-nfties - NIFTY remote hack

*Should we call ERC-721 tokens Nifties or Nfties? You decide by crafting monsters with or without eyes.*

![nftiesio.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/niftiesvsnftiestitle.jpg)

Visit https://nifties.io or https://nfties.io depending one which one you like best!

I'm not able to attend the [NIFTY hackathon in Hong Kong](https://www.nifty.gg/), but I love to **#BUIDL** with NFTs so I decided to take the day off work to make a fun little project based around this poll about 👁️'s in Nifties:

![the great poll begins](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/thegreatpoll.png)

Other than the rule about physically being there, I will follow all of their [hackathon rules posted here](https://niftyhacks.devpost.com/rules) and do my best to document my process.

----

### 9:30 AM - Create React App

To prepare the repo with the correct directory structure, I'll use **create react app** to kick off the #BUIDL:

```
git clone https://github.com/austintgriffith/nifties-vs-nfties
cd nifties-vs-nfties
npx create-react-app .
npm i
```

---

### 10:00 AM - Uploaded Assets

I created the **Nifties** vs **Nfties** monsters by drawing each different piece in a different layer in Photoshop. Then, I exported each layer using [this tool](https://github.com/jwa107/Photoshop-Export-Layers-to-Files-Fast). Finally, I built [a node script](https://gist.github.com/austintgriffith/e79373979f8d47b23656464942668177) that composes all the different layers in all the different combinations to produce the static assets.

Each token consists of a different head, body, mouth, feet, etc... I wanted to make them static assets and not dynamically generate them each time. This allows me to upload them to IPFS or a similar service and not have any traditional backend.

Here is an example token *nfties-5-4-5-3-5.png* (body 5, feet 4, head 5, mouth 3, extra 5):

![nfties-5-4-5-3-5.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/tokens/nfties-5-4-5-3-5.png)

*Note: these files are too big. I already started the upload because I'm moving fast on this, but I will want to do a second pass and shrink these to about 25% their current size.*

---

### 10:45 AM - Carve out service worker & clean up CRA

One of the first things I do when building a Dapp is carve out the service worker from [index.js](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/index.js) because of issues you end up having down the road with web3, ssl, and android:
https://medium.com/coinmonks/react-service-worker-web3-android-98970a6691ad

I also like to strip CRA down to just the basics and get a little cleaner [App.css](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/App.css) file ready. Plus getting the favicon looking right and add in the SEO junk.

---

### 10:50 AM - Clevis & Zeppelin

I have my own blockchain orchestration tool called **Clevis** that is similar to Truffle. Building it helped me understand a lot of the underlying mechanics work so I stick to using it instead of switching to Truffle, but they can work harmoniously together if needed. Learn more about clevis here: https://github.com/austintgriffith/clevis

```
clevis init
```

We are also going to need OpenZeppelin's wonderful library of contracts to extend:

```
git clone https://github.com/OpenZeppelin/openzeppelin-solidity.git
```


---

### 12:10 PM - Write Nifties and Nfties Smart Contracts

The smart contracts will be fairly simple. We will want to extend the fantastic work by **OpenZeppelin** to create our own ERC-721s with metadata for the different parts of the NFT monsters:

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

It will take me a bit to write these smart contracts. I'll used **Clevis** to create, compile, deploy, and publish these contracts into my app after firing up a local testrpc:

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

Hacking these contracts up quickly reminded me of whailing away on the contracts for my game **Cryptogs.io** in the hotel room at **#EthDenver**. Here is one of the more interesting commits from that night: https://github.com/austintgriffith/cryptogs/commit/4cada47cbb18a8a27221b10b38ccb98ad80f5006

---


### 12:45 PM - Dapparat.us: Metamask

After participating in a few hackathons and building out a couple blockchain games, I found that I was reusing a lot of the same React components... everything from the simple account display to event parsing to transactions UI/UX.

I wouldn't be able to build this project out so quickly without my NPM package called [Dapparatus](https://www.npmjs.com/package/dapparatus). There will also, no doubt, be some commits to this repo throughout the day too. It is evolving quickly:
https://github.com/austintgriffith/dapparatus

Let's bring in the **dapparatus** package and start building out our frontend to talk to our contracts:

```
npm install --save dapparatus
```

In the **App.js** I'll bring in all the **Dapparatus** components:

```
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler } from "dapparatus"
```

The **Metamask** object is the first and most important. It watches for the injected web3 provider and ships updates to your main app as blocks, balances, etc change:

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

---

### 1:30 PM - Dapparat.us: Gas, ContractLoader, Transactions, Events

I'll breeze through the rest of the components as I add them into the **App.js**.  

**Gas** used to be a slider, but gas sliders are so Q1 2018 🤣. I pulled the slider interface out and now I count on the [ethgasstation api](https://ethgasstation.info/json/ethgasAPI.json) to get the gas just right every time.

```
<Gas
  onUpdate={(state)=>{
    console.log("Gas price update:",state)
    this.setState(state,()=>{
      console.log("GWEI set:",this.state)
    })
  }}
/>
```

This will keep our app up-to-date with current gas prices and even apply a small multiplier to make sure our transactions will go through quickly:

```
Gas price update: {gwei: 3.21}
```

The **Transactions** component gives us a nice UI down in the corner that shows the blocks being loaded and our transactions with the blockchain:

```
<Transactions
  account={account}
  gwei={gwei}
  web3={web3}
  block={block}
  avgBlockTime={avgBlockTime}
  etherscan={etherscan}
  onReady={(state)=>{
    console.log("Transactions component is ready:",state)
    this.setState(state)
  }}
/>
```

![blockloader.gif](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/blockloader.gif)

The **ContractLoader** uses the files published by **Clevis** to prepare an interface with the contracts.

```
<ContractLoader
  config={{hide:false}}
  web3={web3}
  require={path => {return require(`${__dirname}/${path}`)}}
  onReady={(contracts)=>{
    console.log("contracts loaded",contracts)
    this.setState({contracts:contracts})
  }}
/>
```

At first I leave the hide:false so I can see the contracts come in right on the page:

![public/contractscreen.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/contractscreen.png)

The **Events** component is used to follow events from contracts. I will use this to keep a long list of each token created from either contract. I could also use it to list the current user's using a **filter** object, but I'll actually just poll the contract for that later.

```
<Events
  contract={contracts.Nifties}
  eventName={"Create"}
  block={block}
  id={"_id"}
  onUpdate={(eventData,allEvents)=>{
    this.setState({nifties:allEvents})
  }}
/>
<Events
  contract={contracts.Nfties}
  eventName={"Create"}
  block={block}
  id={"_id"}
  onUpdate={(eventData,allEvents)=>{
    this.setState({nfties:allEvents})
  }}
/>
```

Awesome. Time for more ☕


---

### 2:30 PM - Mock out the design in React & the Dapparat.us Scaler

Starting with the title image, I will wrap most of my UI with a **Scaler** from the **Dapparatus** library. After building a few blockchain games that must look good on both a desktop machine and mobile wallet like **Trust**, you quickly realized it's a huge pain to make your Dapp responsive. That's where the **Scaler** component comes in. Basically, you can control sizing depending on the screen size dynamically.

```
<div style={{width:"100%",height:160,backgroundColor:"#282828"}}>
  <Scaler config={{origin:"50px 50px",adjustedZoom:1.3}}>
    <img style={{position:"absolute",left:10,top:10,maxHeight:120,margin:10}} src="niftiesvsnfties.png"/>
  </Scaler>
</div>
```

![screenscale.gif](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/screenscale.gif)

The vision I have for the app is that it will be hosted on both nifties.io and nfties.io and depending on what domain you are coming in on you get that respective UI. Nifties.io will mean you are in the yes-eye-in-nifities camp. I'm going to mock out this design first and then build it to be responsive later.

There will be two different calls-to-action; the main one will be to "Feed The Nifties" which will trigger a transaction to the Nifities smart contract and create a new Niftie in your inventory. However, if you think maybe you want to be in the no-eye-in-nfties camp, there is a second button that will take you to nfties.io where you can "Feed The Nfties".

Next I'm going to use a **StackGrid** (https://github.com/tsuyoshiwada/react-stack-grid) to split the page into two columns and then a nested **StackGrid** for each set up monsters. This will make it look really nice on both desktop and mobile browsers.

```
npm install --save react-stack-grid
```

```
<StackGrid columnWidth={"50%"}>
  <div key="key1" className={"col"}>{leftCol}</div>
  <div key="key2" className={"col"}>{rightCol}</div>
</StackGrid>
```

Each column is then mocked up with a **Scaler** for the button:

```
<div>
  <Scaler config={{origin:"center top",adjustedZoom:1.4}}>
    <img src="feedthenifties.png" style={bigButtonStyle}/>
  </Scaler>
  <StackGrid columnWidth={93}>
    <div key="key1"><img src={"tokens/nifties-5-7-7-2.png"} style={niftiesStyle}/></div>
    <div key="key2"><img src={"tokens/nifties-2-6-3-6.png"} style={niftiesStyle}/></div>
    <div key="key3"><img src={"tokens/nifties-5-7-7-2.png"} style={niftiesStyle}/></div>
    <div key="key4"><img src={"tokens/nifties-2-6-3-6.png"} style={niftiesStyle}/></div>
    <div key="key5"><img src={"tokens/nifties-5-7-7-2.png"} style={niftiesStyle}/></div>
    <div key="key6"><img src={"tokens/nifties-2-6-3-6.png"} style={niftiesStyle}/></div>
    <div key="key7"><img src={"tokens/nifties-5-7-7-2.png"} style={niftiesStyle}/></div>
    <div key="key8"><img src={"tokens/nifties-2-6-3-6.png"} style={niftiesStyle}/></div>
  </StackGrid>
</div>
```

Man, this is looking really good!

![gridscale.gif](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/gridscale.gif)

Next, when they click the "Feed" button it will eventually make a transaction, but for now I want it to open up an Inventory to show the player what monsters they have collected so far. I'll be using the **react-motion** NPM to make this look good.

```
npm install --save react-motion
```

```
<Motion
      defaultStyle={{
        openAmount:0
      }}
      style={{
        openAmount:spring(this.state.openInventory,{ stiffness: 80, damping: 8 })
      }}
      >
      {currentStyles => {
        return (
          <div style={{position:"relative",overflow:"hidden",width:"100%",backgroundImage:"url('grad1.png')", backgroundRepeat:"repeat-x",height:currentStyles.openAmount,borderBottom:"3px solid #444444",borderTop:"1px solid #444444"}}>
            <Scaler config={{origin:"right 50px",adjustedZoom:1.2}}>
              <img src="twitterbutton.png" style={{maxWidth:150,margin:10,float:'right',marginRight:15,cursor:"pointer"}}/>
            </Scaler>
            <div style={{position:"absolute",left:20,top:-15}}><img src={"tokens/nifties-2-7-3-4.png"} style={{maxHeight:160}}/></div>
            <div style={{position:"absolute",left:90,top:-15}}><img src={"tokens/nifties-5-3-6-3.png"} style={{maxHeight:160}}/></div>
            <div style={{position:"absolute",left:160,top:-15}}><img src={"tokens/nifties-2-4-7-1.png"} style={{maxHeight:160}}/></div>
            <div style={{position:"absolute",left:230,top:-15}}><img src={"tokens/nifties-1-5-4-2.png"} style={{maxHeight:160}}/></div>
          </div>
        )
      }}
</Motion>
```

Since the original Nifties vs Nfties debate was just a Twitter back-and-forth, @mattgcondon suggested that I have a button that will let you post your vote/inventory to Twitter. I *really* like how the Twitter button turned out when I drew it to fit the same theme.


![inventory.gif](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/inventory.gif)

---

### 3:15 PM - Interacting with the Smart Contracts - Wiring up Buttons

The next step is to create the **Niftie** component to handle the logic of creating new tokens and displaying the inventory of the player.

The key to these components is the **loadTokensOfOwner** interval which is constantly polling the contract:

```
let tokensOfOwner = await contract.tokensOfOwner(account).call()
```

And then we want the "Feed The Nifties" button to trigger the create function of the contract:

```  
<img src="feedthenifties.png" style={bigButtonStyle} onClick={()=>{
    tx(contracts.Nifties.create())
}} />
```

Check out the code for the the [Nifties.js component here](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/Nifties.js).

---

### 3:45 PM - Parse Create Events and Display Tokens

Next we need to watch for all **Create** events and display the list of all votes for each contract. Thanks to the **Events** components we already loaded in, we should have an array in the state object for all **Nifties** and **Nfties** created. This probably won't scale, but for a fast and loose implementation I'm just going to display the last 20 with a total count.

I'm also going to display the identicon for the owner of each monster too.

```
npm install --save 'react-blockies'
import Blockies from 'react-blockies'
```

```
let niftieDisplayCount = 0
let allNifties = this.state.nifties.map((token)=>{
  while(niftieDisplayCount++<TOKENDISPLAYLIMIT){
    let thisImage = "tokens/nifties-"+token._body+"-"+token._feet+"-"+token._head+"-"+token._mouth+".png";
    return (
      <div key={"niftieToken"+token._id}>
        <div style={{position:'absolute',right:0,bottom:40}}>
          <Blockies
            seed={token._owner.toLowerCase()}
            scale={2}
          />
        </div>
        <img src={thisImage} style={niftiesStyle}/>
      </div>
    )
  }
})
```

---

### 4:00 PM - Run React on Port 80 - Hostname nfties.io vs nifties.io

Okay most of the functionality is working for the Nifities. As I mentioned earlier, I'd like to run this thing on two different domains because I bought both nfties.io and nifties.io in a crime of passion. Do you do that too? I own so many stupid domains. Anyways, I'm going to run the server on port 80 and then use my /etc/hosts to point both nfties.io vs nifties.io localhost. Then, I can have my source code detect what domain you are on and display it correctly.

```
10.0.0.107 nfties.io
10.0.0.107 nifties.io
```

Now when I visit nfties.io it brings me to the right page, I just have to detect it and swap things around.


![nftiesio.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/nftiesio.png)

---

### 5:00 PM - Detect Domains and Display Correctly

Here is an example of how I'm detecting the hostname and swapping out the display:

```
let titleImage = "niftiesvsnfties.png"
if(window.location.hostname=="nfties.io"){
  titleImage = "nftiesvsnifties.png"
}
```

Now I just have to do that all over the page... *hold my beer*.

While I was doing that I also tweaked the inventory display to offset based on the screen width. Now, no matter how many times you vote and create new monsters, they will show up next to the tweet button and fit.

I think I have all the buttons working except the Twitter button and I'll save that for last. Wooooooo!

---

### 5:45 PM - Deploy Content to AWS

One neat thing about having the blockchain as your backend is your code is all static. It can be served out of CloudFront, S3, IPFS, you name it. Someone could even just pull down your repo and run it locally.

The next phase of the **#buidl** is to get a deployment pipeline working. That will mean creating a few things in the AWS console.

First, I created two new **AWS S3** buckets with the same name as the domain I wanted to host: **nifties.io** and **nfties.io**.

Then, for each bucket I setup "Static website hosting".

Now, I need to deploy my code to S3. I already have a deployment script I use for Cryptogs.io and Galleass.io so no need to reinvent the wheel. I'll copy that in and set it up to run for both Nifties.io and Nfties.io and fire it off. [Here is the script I used.](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/deployNifties.js)

Because I'm uploading a shart load of assets, I have some downtime to work on getting **Cloudfront** and **SSL** in front of these domains. First, I'll use AWS ACM to create SSL certificates for both domains. Because I have the domains registered in AWS Route53, Amazon does all the DNS validation for me, I just click through the dialogs.

*Note: Make sure you get your ACM certificates in the same region as your S3 bucket*

Next, I jump over to the CloudFront panel and create distributions for the S3 buckets.

```
Origin Domain Name: nifties.io.s3-website-us-east-1.amazonaws.com
Viewer Protocol Policy: Redirect HTTP to HTTPS
CNAMEs: nifties.io -> Custom SSL Certificate
Default Root Object: index.html
```

(I had to manually paste in the ARN for my SSL certificate but I'm going as fast as I can here and AWS must have a cache in from of the list.)

I also have to point the DNS in **Route53** to point to the **CloudFront** distributions.

This will take a long dang time. At this point my deploy to nifties.io is finished and I'm currently moving files to nfties.io. I'm going to keep hacking locally to make some finishing touches, preparing for mainnet!

---

### 6:45 PM Finishing Touches & Mainnet Contract Deployment !!!

I added a footer to the site that directs confused visitors back to this **ReadME** to explain what's going on because let's be honest, this was a really weird project.

Next, I setup the twitter button to take the client to a page that allows them to **Tweet** their vote.

Now it's time to deploy these tokens to the **Mainnet**... *Hold on to your butts*!

```
clevis compile Nfties
clevis deploy Nfties 0
```

[View Deployment Trasaction on Etherscan](https://etherscan.io/tx/0x0ee4760b2dd286ce6b443ac25b2b2e2dcc09e7efc80ff49448d8678de3429a31) (It cost me $1.83. I love this technology so much.)

[Public & Verified Nfties Token  Contract](https://etherscan.io/address/0x4646Dea7e251fefd74e3FAC63c63BE6e6Efc721c#code)

```
clevis compile Nifties
clevis deploy Nifties 0
```

[View Deployment Trasaction on Etherscan](https://etherscan.io/tx/0x6ea6f5b478605decfc02264736e460ebefc41affad5a5e816b09dd5236e00532)


[Public & Verified Nifties Token  Contract](https://etherscan.io/address/0xf9b6e3e9ae83dcadd2bdd422fa810ffd34492264#code)



Visit https://nifties.io or https://nfties.io depending one which one you like best!

---

### 5:30 AM -- [Centralization](#centralization) - or how I stopped worrying about blockchain and learned to love user experience

Well the title says it all. When you build out an awesome Dapp on Ethereum, you find out that not very many people out there want to have Metamask logged in and running.

You see that Twitter will bring curious people in to look at your app, but they will be presented with a data-less wall of uncertainty without having a mobile Wallet connected to Ethereum.

The next step, my friends, is to embrace just a little bit of centralization. I wrote a really weird article about this here: https://medium.com/coinmonks/cryptogs-io-putting-the-d-in-dapp-b7e40ca594dd

Technically, for the NIFTY hackathon, I said I would follow the rules and I'm still within my 24 hour window so I'm going to try to hack up a backend just to show how it all works.

The first step is to spin up a tiny EC2 instance. This is where your costs will start to incur. Next, an ELB in front of that with an ACM SSL certificate. I chose use the domain: https://cache.nifties.io

It's not scalable, it's exposed, and susceptible to classic web2 hacks, but that's the cold hard truth Dapp developers face when users won't inject their own web3.

My backend server is very simple; it has a single GET endpoint that serves up all the NIFTIES and NFTIES data:

```
app.get('/', (req, res) => {
  console.log("/")
  res.set('Content-Type', 'application/json');
  res.end(JSON.stringify({Nifties:Nifties,Nfties:Nfties}));
});
```

To get the data, I'm using an event parser similar to the Dapparatus component and web3 to run down the chain of a local instance of Geth. You can learn more about setting up Geth from this post: https://medium.com/coinmonks/going-fully-decentralized-on-the-cheap-33e6e718131a

The whole backend setup went like this:
```
mkdir nifties-backend
cd nifties-backend
npm init
npm install --save express
npm install --save helmet
npm install --save body-parser
npm install --save web3
```

The main backend code is [here](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/backend/niftiescache.js) and the modules are: [contractLoader](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/backend/modules/contractLoader.js), [eventParser](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/backend/modules/eventParser.js), and [liveParser](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/backend/modules/liveParser.js).

----

On the frontend, I'll install Axios:
```
npm install --save axios
```

You can pulled the cached data using:
```
loadCachedData(){
  if(!this.state.web3 || !this.state.contracts){
    console.log("No local web3, load data from a centralized cache :(")
    axios.get('https://cache.nifties.io/')
    .then((response)=>{
      this.setState(response.data);
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}
```

Then you can switch out your cached data when the real blockchain data arrives with:
```
let niftiesObject = this.state.nifties
if(!niftiesObject) niftiesObject = this.state.cachednifties
let allNifties = niftiesObject.map((token)=>{
```

And just like that, even when someone visits without any kind of injected web3, the will still get a list of monsters and see how the votes look...

### Without MetaMask:

[![screenwithcaching.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/screenwithcaching.png) https://nifties.io (cached without web3)](https://nifties.io)

### With MetaMask:

[![screenwithmetamask.png](https://raw.githubusercontent.com/austintgriffith/nifties-vs-nfties/master/public/screenwithmetamask.png) https://nifties.io (with web3 injected)](https://nifties.io)

The backend needed to run at boot, but since the Geth node is still syncing at boot, I wait until I can start reading the **name** from the **Nifties** contract before I start parsing down the chain:

```
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
```

Finally, I needed to make sure this backend started at boot so I did:

```
cd backend
pm2 start niftiescache.js
pm2 save
pm2 startup
```

-----

## Final Thoughts

I made a couple changes after my 24 hour window to help with UI/UX:

1) I reuploaded the same set of images but compressed down to 160x160 to the /monsters/ directory. So the tokenURI still points to the large 400x400 assets in the /tokens/ directory, but when they are displayed as a large grid on the frontend, they are 160x160. This decreased page load time immensely.  

| /monsters/  | /tokens |
| ------------- | ------------- |
| ![nifties-2-3-3-4](https://nifties.io/monsters/nifties-2-3-3-4.png)  | ![](https://nifties.io/tokens/nifties-2-3-3-4.png)  |
| (160x160 45KB) | (400x400 152KB)  |

2) I added just a little more wording to make it clear exaclty what was going on. "Should we call ERC-721 tokens Nifties or Nfties? You decide..."

3) The Geth cache server is good and keeps non-web3 clients updated live, but I wanted to make sure there wasn't any single point of failure. I upgraded [the backend](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/backend/niftiescache.js) to push an [offline.js](https://nifties.io/offline.js) file every time there is a new **Create** event triggered (debounced of course). This way, even if my cache.nifties.io endpoint were to fail, the latest state will remain on the static server, loaded in the [index.html](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/public/index.html#L35). Non-web3 visitors will still get a general idea of what's up, even if it is behind a few votes. One gotcha here is CloudFront does a lot of caching in front of this offline.js so it could be served stale. So the site loads the offline.js first, then hit's the https://cache.nifties.io to get more up-to-date information, and finally tries to hit your injected web3 to pull from the directly (through metamask/trust -> infura etc).



Thanks for following along with the NIFTY hack. If you have any questions or feedback hit me up on [twitter](https://twitter.com/austingriffith). Learn more about me at https://austingriffith.com Thanks!

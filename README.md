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

### 10: AM - Carve out service worker & clean up CRA

One of the first things I do when building a Dapp is carve out the service worker from [index.js](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/index.js) because of issues you end up having down the road with web3, ssl, and android:
https://medium.com/coinmonks/react-service-worker-web3-android-98970a6691ad

I also like to strip CRA down to just the basics and get a little cleaner [App.css](https://github.com/austintgriffith/nifties-vs-nfties/blob/master/src/App.css) file ready.

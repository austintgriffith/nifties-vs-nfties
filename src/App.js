import React, { Component } from 'react';
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler } from "dapparatus"
import {Motion, spring, presets} from 'react-motion'
import Blockies from 'react-blockies'
import Web3 from 'web3';
import Nifties from './Nifties.js';
import Nfties from './Nfties.js';
import StackGrid from "react-stack-grid";

import './App.css';

const TOKENDISPLAYLIMIT = 20

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: false,
      account: false,
      gwei: 4,
      openInventory: 0,
      nifties: [],
      nfties: [],
    }
  }
  componentDidMount() {
    //the grid is weird so we have to force a couple updates to get it to
    //shake loose... dirty hack but it works
    setTimeout(()=>{this.forceUpdate()},1000)
    setTimeout(()=>{this.forceUpdate()},3000)
    setTimeout(()=>{this.forceUpdate()},9000)
  }
  render() {
    let {web3,account,contracts,tx,gwei,block,avgBlockTime,etherscan} = this.state

    let nft = (window.location.hostname=="nfties.io")

    let metamask = (
      <Metamask
        onUpdate={(state)=>{
          console.log("metamask state update:",state)
          if(state.web3Provider) {
            state.web3 = new Web3(state.web3Provider)
            this.setState(state)
          }
        }}
      />
    )

    let connectedDisplay = ""
    let events = ""
    if(web3){
      connectedDisplay = (
        <div>
          <ContractLoader
            web3={web3}
            require={path => {return require(`${__dirname}/${path}`)}}
            onReady={(contracts)=>{
              console.log("contracts loaded",contracts)
              this.setState({contracts:contracts})
            }}
          />
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
          <Gas
            onUpdate={(state)=>{
              console.log("Gas price update:",state)
              this.setState(state,()=>{
                console.log("GWEI set:",this.state)
              })
            }}
          />
        </div>
      )

      if(contracts){
        events = (
          <div>
            <Events
              contract={contracts.Nifties}
              eventName={"Create"}
              block={block}
              id={"_id"}
              onUpdate={(eventData,allEvents)=>{
                this.setState({nifties:allEvents.reverse()})
              }}
            />
            <Events
              contract={contracts.Nfties}
              eventName={"Create"}
              block={block}
              id={"_id"}
              onUpdate={(eventData,allEvents)=>{
                this.setState({nfties:allEvents.reverse()})
              }}
            />
          </div>
        )
      }
    }


    let titleImage = "niftiesvsnfties.png"
    if(nft){
      titleImage = "nftiesvsnifties.png"
    }

    let title = (
      <div style={{width:"100%",height:160,backgroundColor:"#282828"}}>
        <Scaler config={{origin:"50px 50px",adjustedZoom:1.3}}>
          <img style={{position:"absolute",left:10,top:10,maxHeight:120,margin:10}} src={titleImage}/>
        </Scaler>
      </div>
    )

    let inventory

    if(web3&&contracts&&contracts.Nfties&&contracts.Nifties){

      let theNftDisplay = ""

      if(nft){
        theNftDisplay = (
          <Nfties
            contract={contracts.Nfties}
            account={account}
            web3={web3}
            tx={tx}
            onUpdate={(tokensOfOwner)=>{
              if(tokensOfOwner.length>0){
                this.setState({openInventory:160})
              }
            }}
          />
        )
      }else{
        theNftDisplay = (
          <Nifties
            contract={contracts.Nifties}
            account={account}
            web3={web3}
            tx={tx}
            onUpdate={(tokensOfOwner)=>{
              if(tokensOfOwner.length>0){
                this.setState({openInventory:160})
              }
            }}
          />
        )
      }

      inventory = (
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
                  {theNftDisplay}
                 </div>
               )
             }}
        </Motion>
      )
    }

    let bigButtonStyle = {
        maxWidth:200,
        cursor:"pointer"
    }
    let niftiesStyle = {
      maxWidth:100,
      zIndex:10
    }

    let niftieDisplayCount = 0
    let allNifties = this.state.nifties.map((token)=>{
      if(token._id && niftieDisplayCount++<TOKENDISPLAYLIMIT){
        let thisImage = "tokens/nifties-"+token._body+"-"+token._feet+"-"+token._head+"-"+token._mouth+".png";
        return (
          <div key={"niftieToken"+niftieDisplayCount}>
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

    let niftiesCount = 0
    if(this.state.nifties){
      niftiesCount = this.state.nifties.length
    }
    let niftCTA = ""
    if(!nft){
      niftCTA = (
        <img src="feedthenifties.png" style={bigButtonStyle} onClick={()=>{
          tx(contracts.Nifties.create())
        }} />
      )
    }else{
      niftCTA = (
        <img src="yeseyeinnifties.png" style={bigButtonStyle} onClick={()=>{
          window.location = "http://nifties.io"
        }} />
      )
    }
    let leftCol = (
      <div>
        <Scaler config={{origin:"center top",adjustedZoom:1.4}}>
          {niftCTA}
        </Scaler>
        <div style={{position:"absolute",right:80,top:126}}>
          ( {niftiesCount} )
        </div>
        <StackGrid columnWidth={93}>
          {allNifties}
        </StackGrid>
      </div>
    )


    let nftieDisplayCount = 0
    let allNfties = this.state.nfties.map((token)=>{

      if(token._id && nftieDisplayCount++<TOKENDISPLAYLIMIT){
        let thisImage = "tokens/nfties-"+token._body+"-"+token._feet+"-"+token._head+"-"+token._mouth+"-"+token._extra+".png";
        return (
          <div key={"nftieToken"+nftieDisplayCount}>
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

    let nftiesCount = 0
    if(this.state.nfties){
      nftiesCount = this.state.nfties.length
    }

    let nftCTA = ""
    if(nft){
      nftCTA = (
        <img src="feedthenfties.png" style={bigButtonStyle} onClick={()=>{
          tx(contracts.Nfties.create())
        }} />
      )
    }else{
      nftCTA = (
        <img src="noeyeinnfties.png" style={bigButtonStyle} onClick={()=>{
          window.location = "http://nfties.io"
        }} />
      )
    }

    let rightCol = (
      <div>
        <Scaler config={{origin:"center top",adjustedZoom:1.4}}>
          {nftCTA}
        </Scaler>
        <div style={{position:"absolute",right:80,top:126}}>
          ( {nftiesCount} )
        </div>
        <StackGrid columnWidth={93}>
          {allNfties}
        </StackGrid>
      </div>
    )

    let grid = ""

    if(nft){
      grid = (
        <StackGrid columnWidth={"50%"}>
          <div key="rightCol" className={"col"}>{rightCol}</div>
          <div key="leftCol" className={"col"}>{leftCol}</div>
        </StackGrid>
      )
    }else{
      grid = (
        <StackGrid columnWidth={"50%"}>
          <div key="leftCol" className={"col"}>{leftCol}</div>
          <div key="rightCol" className={"col"}>{rightCol}</div>
        </StackGrid>
      )
    }


    return (
      <div className="App">
        {metamask}
        {connectedDisplay}
        {events}
        {title}
        {inventory}
        {grid}
      </div>
    );
  }
}
export default App;

import React, { Component } from 'react';
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler } from "dapparatus"
import {Motion, spring, presets} from 'react-motion'
import Web3 from 'web3';
import StackGrid from "react-stack-grid";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: false,
      account: false,
      gwei: 4,
      openInventory: 0
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
                console.log("EVENT DATA:",eventData)
                this.setState({events:allEvents})
              }}
            />
            <Events
              contract={contracts.Nfties}
              eventName={"Create"}
              block={block}
              id={"_id"}
              onUpdate={(eventData,allEvents)=>{
                console.log("EVENT DATA:",eventData)
                this.setState({events:allEvents})
              }}
            />
          </div>
        )
      }
    }

    let title = (
      <div style={{width:"100%",height:160,backgroundColor:"#282828"}}>
        <Scaler config={{origin:"50px 50px",adjustedZoom:1.3}}>
          <img style={{position:"absolute",left:10,top:10,maxHeight:120,margin:10}} src="niftiesvsnfties.png"/>
        </Scaler>
      </div>
    )

    let inventory = (
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
    )


    let bigButtonStyle = {
        maxWidth:200,
        cursor:"pointer"
    }
    let niftiesStyle = {
      maxWidth:100
    }

    let leftCol = (
      <div>
        <Scaler config={{origin:"center top",adjustedZoom:1.4}}>
          <img src="feedthenifties.png" style={bigButtonStyle} onClick={()=>{this.setState({openInventory:160})}}/>
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
    )

    let rightCol = (
      <div>
        <Scaler config={{origin:"center top",adjustedZoom:1.4}}>
          <img src="noeyeinnfties.png" style={bigButtonStyle}/>
        </Scaler>
        <StackGrid columnWidth={93}>
          <div key="key1"><img src={"tokens/nfties-5-3-3-2-3.png"} style={niftiesStyle}/></div>
          <div key="key2"><img src={"tokens/nfties-2-1-3-1-2.png"} style={niftiesStyle}/></div>
          <div key="key3"><img src={"tokens/nfties-5-2-4-2-1.png"} style={niftiesStyle}/></div>
          <div key="key4"><img src={"tokens/nfties-2-2-3-3-1.png"} style={niftiesStyle}/></div>
          <div key="key5"><img src={"tokens/nfties-5-5-3-2-2.png"} style={niftiesStyle}/></div>
          <div key="key6"><img src={"tokens/nfties-2-4-3-2-5.png"} style={niftiesStyle}/></div>
          <div key="key7"><img src={"tokens/nfties-5-3-4-2-4.png"} style={niftiesStyle}/></div>
          <div key="key8"><img src={"tokens/nfties-2-5-3-1-2.png"} style={niftiesStyle}/></div>
        </StackGrid>
      </div>
    )


    return (
      <div className="App">
        {metamask}
        {connectedDisplay}
        {events}

        {title}

        {inventory}

        <StackGrid columnWidth={"50%"}>
          <div key="leftCol" className={"col"}>{leftCol}</div>
          <div key="rightCol" className={"col"}>{rightCol}</div>
        </StackGrid>

      </div>
    );
  }
}
export default App;

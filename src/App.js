import React, { Component } from 'react';
import { Metamask, Gas, ContractLoader, Transactions, Events } from "dapparatus"
import Web3 from 'web3';
import './App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: false,
      account: false,
      gwei: 4,
    }
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
            config={{hide:false}}
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

    return (
      <div className="App">
        {metamask}
        {connectedDisplay}
        {events}
      </div>
    );
  }
}
export default App;

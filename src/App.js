import React, { Component } from 'react';
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler } from "dapparatus"
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
        /*config={{requiredNetwork:['Ropsten']}}*/
        onUpdate={(state)=>{
          console.log("metamask state update:",state)
          if(state.web3Provider) {
            state.web3 = new Web3(state.web3Provider)
            this.setState(state)
          }
        }}
      />
    )
    return (
      <div className="App">
        {metamask}
      </div>
    );
  }
}
export default App;

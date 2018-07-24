import React, { Component } from 'react';
import { Scaler } from "dapparatus"

let pollInterval
let pollTime = 1001

class Nfties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokensOfOwner: false
    }
  }
  componentDidMount(){
    pollInterval = setInterval(this.loadTokensOfOwner.bind(this),pollTime)
    this.loadTokensOfOwner()
  }
  componentWillUnmount(){
    clearInterval(pollInterval)
  }
  async loadTokensOfOwner(){
    let {contract,account,web3} = this.props
    let tokensOfOwner = await contract.tokensOfOwner(account).call()
    let tokensOfOwnerArray = []
    for(let i in tokensOfOwner){
      let id=tokensOfOwner[i]
      let token = await contract.get(id).call()
      let tokenUri = await contract.tokenURI(id).call()
      let tokenObject = {
        id: id,
        owner: token.owner,
        body: token.body,
        feet: token.feet,
        head: token.head,
        mouth: token.mouth,
        extra: token.extra,
        birthBlock: token.birthBlock,
        uri: tokenUri
      }
      tokensOfOwnerArray.push(tokenObject)
    }
    if(tokensOfOwner!=tokensOfOwnerArray){
      this.setState({tokensOfOwner:tokensOfOwnerArray})
      this.props.onUpdate(tokensOfOwnerArray)
    }
  }
  render() {
    let {tokensOfOwner} = this.state
    let tokensOfOwnerDisplay = "loading tokens..."
    if(tokensOfOwner){
      let offset = -60
      let totalCanDisplay = ((document.documentElement.clientWidth-140)/80)

      if(tokensOfOwner.length>totalCanDisplay){
        offset -= (tokensOfOwner.length-(totalCanDisplay-1))*80
      }

      tokensOfOwnerDisplay = tokensOfOwner.map((token)=>{
        let thisImage = "tokens/nfties-"+token.body+"-"+token.feet+"-"+token.head+"-"+token.mouth+"-"+token.extra+".png";
        //console.log("As a sanity check, make sure "+thisImage+" and "+token.uri+" match")
        offset+=80
        return (
          <div key={"Nftie"+token.id} style={{position:"absolute",left:offset,top:-5}}>
            <img src={thisImage} style={{maxHeight:160}}/>
          </div>
        )
      })
    }
    return (
      <div>
        <Scaler config={{origin:"right 50px",adjustedZoom:1.2}}>
        <a href={"https://twitter.com/intent/tweet?text="+encodeURI("I minted "+tokensOfOwner.length+" NFTIES to vote, \"No 👁️ in https://nfties.io\"")+"&hashtags=nifties-vs-nfties"} >
          <img src="twitterbutton.png" style={{zIndex:128,maxWidth:150,margin:10,float:'right',marginRight:15,cursor:"pointer"}} />
        </a>
        </Scaler>
        {tokensOfOwnerDisplay}
      </div>
    );
  }
}

export default Nfties;

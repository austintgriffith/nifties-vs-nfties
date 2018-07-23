//
// usage: node contract ApprovalForAll Nfties
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('ApprovalForAll', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}

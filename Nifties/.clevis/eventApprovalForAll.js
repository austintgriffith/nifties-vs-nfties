//
// usage: node contract ApprovalForAll Nifties
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('ApprovalForAll', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}

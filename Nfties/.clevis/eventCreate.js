//
// usage: node contract Create Nfties
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Create', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}

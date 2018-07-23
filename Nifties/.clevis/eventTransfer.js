//
// usage: node contract Transfer Nifties
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Transfer', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}

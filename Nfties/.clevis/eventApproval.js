//
// usage: node contract Approval Nfties
//
module.exports = (contract,params,args)=>{
  return contract.getPastEvents('Approval', {
      fromBlock: params.blockNumber,
      toBlock: 'latest'
  })
}

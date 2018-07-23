//
// usage: clevis contract setApprovalForAll Nfties ##accountindex## _to _approved
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running setApprovalForAll("+args[4]+","+args[5]+") as account ["+params.accounts[args[3]]+"]")
  return contract.methods.setApprovalForAll(args[4],(args[5]==="true")).send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}

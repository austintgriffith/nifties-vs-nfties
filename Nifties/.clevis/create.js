//
// usage: clevis contract create Nifties ##accountindex## 
//

module.exports = (contract,params,args)=>{
  const DEBUG = false
  if(DEBUG) console.log("**== Running create() as account ["+params.accounts[args[3]]+"]")
  return contract.methods.create().send({
    from: params.accounts[args[3]],
    gas: params.gas,
    gasPrice:params.gasPrice
  })
}

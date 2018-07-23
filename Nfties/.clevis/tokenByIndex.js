//
// usage: clevis contract tokenByIndex Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.tokenByIndex(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

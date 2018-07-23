//
// usage: clevis contract tokenOfOwnerByIndex Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.tokenOfOwnerByIndex(args[3],args[4]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

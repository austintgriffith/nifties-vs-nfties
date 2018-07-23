//
// usage: clevis contract isApprovedForAll Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.isApprovedForAll(args[3],args[4]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

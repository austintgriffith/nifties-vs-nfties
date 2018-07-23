//
// usage: clevis contract supportsInterface Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.supportsInterface(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

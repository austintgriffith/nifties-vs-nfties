//
// usage: clevis contract supportsInterface Nifties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.supportsInterface(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

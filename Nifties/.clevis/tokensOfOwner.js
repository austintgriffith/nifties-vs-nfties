//
// usage: clevis contract tokensOfOwner Nifties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.tokensOfOwner(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

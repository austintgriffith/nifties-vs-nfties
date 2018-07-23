//
// usage: clevis contract exists Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.exists(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

//
// usage: clevis contract get Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.get(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

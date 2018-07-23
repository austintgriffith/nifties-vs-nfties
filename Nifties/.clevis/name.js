//
// usage: clevis contract name Nifties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.name().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

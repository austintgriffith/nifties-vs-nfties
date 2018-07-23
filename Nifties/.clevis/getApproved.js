//
// usage: clevis contract getApproved Nifties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.getApproved(args[3]).call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

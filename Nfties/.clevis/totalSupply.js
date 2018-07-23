//
// usage: clevis contract totalSupply Nfties
//
module.exports = async (contract,params,args)=>{
  return await contract.methods.totalSupply().call()
  /*.then((##outputs##)=>{
    console.log(##results##)
  })*/
}

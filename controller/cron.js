const cron=(req,res)=>{
    try{
      res.send({application:"RoomEase",developedBy:"Elevance Tech"})
    }catch(error){
        console.log("Error Occured")
    }
}

module.exports={
    cron
}
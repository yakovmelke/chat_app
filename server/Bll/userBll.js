const userModel = require("../model/userModel");

module.exports.register = async (req, res, next) => {
  try {
    const { userName, email } = req.body;
  const userNameCheck = await userModel.findOne({userName})
  if(userNameCheck){
    return res.json({msg:"User Name already used",status:false})
  }
  const emailCheck = await userModel.findOne({email})
  if(emailCheck){
    return res.json({msg:"Email already used",status:false})
  }
  const user = await userModel.create(req.body)
  return res.json({status:true,user})

} catch (error) {
    throw error;
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
  const userNameCheck = await userModel.findOne({userName})
  if(!userNameCheck){
    return res.json({msg:"Incorrect user name or password",status:false})
  }else if(userNameCheck.password !==password){
    return res.json({msg:"Incorrect user name or password",status:false})
  }
 
  return res.json({status:true,userNameCheck})

} catch (error) {
    throw error;
  }
};
module.exports.setAvatar = async (req, res, next) => {
  try {
  const userId= req.params.id
  const avatarImg = req.body.image
  await userModel.findByIdAndUpdate(userId,{
    isAvatarImgSet:true,
    avatarImg
  })

  return res.json({isSet:true,image:avatarImg})
} catch (error) {
    throw error;
  }
};
module.exports.allUsers = async (req, res, next) => {
  try {
  const users = await userModel.find({_id:{$ne:req.params.id}}).select([
    'email','userName','avatarImg',"_id"
  ])

  return res.json(users)
} catch (error) {
    throw error;
  }
};

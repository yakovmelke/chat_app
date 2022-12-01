const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  isAvatarImgSet: {
    type:Boolean,
    default:false
  },
  avatarImg: {
    type:String,
    default:""
  },
});

module.exports = mongoose.model("users", userSchema);

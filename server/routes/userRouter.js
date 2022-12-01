const router =require("express").Router()
const {register, login,setAvatar,allUsers} = require("../Bll/userBll")

router.post('/register',register)
router.post('/login',login)
router.post('/setAvatar/:id',setAvatar)
router.get('/allusers/:id',allUsers)

module.exports = router
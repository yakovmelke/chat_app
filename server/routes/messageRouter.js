const router =require("express").Router()
const {addMessage,getAllMessages} = require("../Bll/messageBll")

router.post('/addmsg',addMessage)
router.post('/getmsg',getAllMessages)

module.exports = router
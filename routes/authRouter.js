
const express = require('express')
const authRouter = express.Router();
const authcontroller = require('../controller/authcontroller')

authRouter.get("/login",authcontroller.getlogin);
authRouter.post("/login",authcontroller.postlogin);
authRouter.post('/logout',authcontroller.postlogout);
authRouter.get('/signup',authcontroller.getsignup);
authRouter.post('/signup',authcontroller.postsignup);


module.exports=authRouter;
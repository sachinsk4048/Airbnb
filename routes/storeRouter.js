
const express = require('express')
const storeRouter = express.Router();
const storecontroller = require('../controller/storecontroller')

storeRouter.get("/",storecontroller.getindex)
storeRouter.get('/home-list',storecontroller.gethome);
storeRouter.get('/bookings',storecontroller.getbookings);
storeRouter.get('/fav-list',storecontroller.getfavlist);

storeRouter.get('/home/:homeid',storecontroller.gethomedetails)
storeRouter.post('/fav-list',storecontroller.postaddtofavourites)
storeRouter.post('/fav-list/delete/:homeid',storecontroller.postremovefavourites)

module.exports=storeRouter;
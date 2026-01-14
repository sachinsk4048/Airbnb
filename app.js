const express = require('express')
const storeRouter = require('./routes/storeRouter')
const hostRouter = require('./routes/hostRouter')
const authRouter = require('./routes/authRouter')
const path = require('path')
const rootdir=require("./util/pathutil")
const app = express(); 
app.set('view engine','ejs')
app.set('views','views')
const homecontroller = require('./controller/storecontroller')
const { Result } = require('postcss')
const { error } = require('console')
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

const db_path = "mongodb+srv://root:root@sachin.08ycelm.mongodb.net/airbnb?retryWrites=true&w=majority&appName=sachin" ;

const store = new mongoDBStore({
  uri:db_path,
  collection:'sessions'
})

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination :(req,file,cb) =>{
    cb(null,"uploads");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage,fileFilter
};


app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootdir,"public")));
app.use("/uploads",express.static(path.join(rootdir,"uploads")));
app.use("/host/uploads",express.static(path.join(rootdir,"uploads")));
app.use("/home/uploads",express.static(path.join(rootdir,"uploads")));


app.use(session({
  secret : 'complete coding secrte',
  resave : false,
  saveUninitialized : true,
  store 
}))

app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})
app.use(storeRouter);

app.use("/host",(req,res,next) =>{
  if(req.isLoggedIn){
    next();
  }else{
    res.redirect('/login');
  }
});
app.use("/host",hostRouter);
app.use(authRouter);
app.use(homecontroller.notfound)


const PORT = 3000;

mongoose.connect(db_path).then (()=>{
  console.log("connecting to mongo");
  app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
  });
}).catch(err =>{
  console.log('error while connecting to db',err);
});


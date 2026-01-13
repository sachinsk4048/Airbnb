const { check, validationResult } = require("express-validator");
const User = require('../modals/user');
const bcrypt = require("bcryptjs");   // ✅ REQUIRED

exports.getlogin = (req, res, next) => {
  res.render("auth/login", {
    title: "Login",    
    editing: false,
    isLoggedIn: false,
    currentPage : 'login',
    errors: [] ,
    oldInput: { email : "" } ,
    user : {},
  
  });
};

exports.postlogin = async (req,res,next) =>{
  console.log(req.body);
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(422).render('auth/login',{
          title: "login",    
          isLoggedIn: false,
          currentPage : 'login',
          errors : ["user does not exist"],
           oldInput: { email, password: "" } 
        });  
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch){
    return res.status(422).render('auth/login',{
          title: "login",    
          isLoggedIn: false,
          currentPage : 'login',
          errors : ["invalid password !!"],
           oldInput: { email, password: "" } 
        });  
  }

  req.session.isLoggedIn = true;
  req.session.user = user
  await req.session.save();
  res.redirect('/');
}

exports.postlogout = (req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect('/login')
  })
};

exports.getsignup = (req, res, next) => {
  res.render("auth/signup", {
    title: "signup",    
    editing: false,
    isLoggedIn: false,
    currentPage : 'signup',
    errors : [],
    oldInput : {firstName : "",lastName : "",email : "",usertype : ""} ,
    user : {},
  });
};

exports.postsignup = [

  check("firstName")
    .trim()
    .isLength({min:2})
    .withMessage("Firts name should be atleast 2 character long")
    .matches(/^[a-zA-z]+$/)
    .withMessage("Firts name should contains only characters"),

  check("lastName")
    .matches(/^[a-zA-z]*$/)
    .withMessage("Last name should contains only characters"),

  check("email")
    .isEmail()
    .withMessage("please enter valid email")
    .normalizeEmail(),

  check('password')
    .isLength({min:8})
    .withMessage("password should be atleast 8 characters long")
    .matches(/[A-Z]/)  
    .withMessage("password should be atleast 1 Uppercase")
    .matches(/[a-z]/)  
    .withMessage("password should be atleast 1 lowercase")
    .matches(/[0-9]/)  
    .withMessage("password should be atleast 1 Number")
    .matches(/[!@#$%^&*]/)  
    .withMessage("password should be atleast 1 special character")
    .trim(),

  check('confirmpassword')
    .trim()
    .custom((value,{req}) =>{
      if(value !== req.body.password){
        throw new Error("password do not match");
      }
      return true;
    }),

  check('usertype')
    .isIn(['guest','host'])
    .withMessage("invalid usertype"),

  // check('terms')
  //   .notEmpty()
  //   .withMessage("please accept the terms and conditions")
  //   .custom((value,{req})=>{
  //     if(value!== "on"){
  //       throw new Error("please accept the terms and conditions");
  //     }
  //     return true;
  //   }),

  (req,res,next) => {

    const {firstName,lastName,email,password,usertype} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup',{
        title: "signup",    
        isLoggedIn: false,
        currentPage : 'signup',
        errors : errors.array().map(err => err.msg),
        oldInput : {firstName,lastName,email,password,usertype},
        user : {},
      });
    }

    bcrypt.hash(password,12)
      .then(hashedPassword =>{
        const user = new User({
          firstName,
          lastName,
          email,
          password : hashedPassword,
          usertype
        });
        return user.save();
      })
      .then(()=>{
        res.redirect('/login');
      })
      .catch(err =>{
        return res.status(422).render('auth/signup',{
          title: "signup",    
          isLoggedIn: false,
          currentPage : 'signup',
          errors : [err.message],
          oldInput : {firstName,lastName,email,password,usertype}
        });
      });

  }  
];   

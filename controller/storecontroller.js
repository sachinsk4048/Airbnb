const home = require("../modals/homes");
const User = require("../modals/user");

exports.getindex = (req, res, next) => {
  home.find().then(registerhome => {
    res.render("store/index", {
      registerhome,
      title: "index",
      currentPage: "index",   // ✅ capital P aur nav.ejs ke hisaab se
      isLoggedIn: req.isLoggedIn,
      user : req.session.user,
    });
  });
};

exports.gethome = (req, res, next) => {
  home.find().then(registerhome => {
    res.render("store/home-list", {
      registerhome,
      title: "home",
      currentPage: "Home",   // ✅ nav.ejs me "Home" hai
      isLoggedIn: req.isLoggedIn,
      user : req.session.user,
    });
  });
};

exports.notfound = (req, res, next) => {
  res.status(404).render("notfound");
};

exports.getbookings = (req, res, next) => {
  res.render("store/bookings", {
    title: "my bookings",
    currentPage: "bookings",   // ✅ nav.ejs me "bookings" hai
    isLoggedIn: req.isLoggedIn,
    user : req.session.user,
  });
};

exports.getfavlist = async (req, res, next) => {
 const userId =  req.session.user._id;
 const user = await User.findById(userId).populate('favourites');
 
      res.render("store/fav-list", {
        favouritehomes : user.favourites,
        title: "favourites",
        currentPage: "favourites",    //✅ nav.ejs me "favourites" hai
        isLoggedIn: req.isLoggedIn,
        user : req.session.user,
      });
};

exports.postaddtofavourites = async (req, res, next) => {
  const homeid = req.body.id;
  const userId = req.session.user._id
  const user = await User.findById(userId);
  if(!user.favourites.includes(homeid)){
    user.favourites.push(homeid);
    await user.save();
  }
   res.redirect("/fav-list");
     
};

exports.postremovefavourites = async (req, res, next) => {
  const homeid = req.params.homeid;
  const userId = req.session.user._id
  const user = await User.findById(userId); 

  if(user.favourites.includes(homeid)){
    user.favourites = user.favourites.filter(fav => fav != homeid);
    await user.save();
  }
      res.redirect("/fav-list");
   
};

exports.gethomedetails = (req, res, next) => {
  const homeid = req.params.homeid;
  home.findById(homeid)
    .then(home => {
      if (!home) {
        console.log("home not found");
        return res.redirect("/home-list");
      }
      res.render("store/home-detail", {
        home,
        title: "home detail",
        currentPage: "Home",   // ✅ home detail bhi Home tab ke andar hai
        isLoggedIn: req.isLoggedIn,
        user : req.session.user,
      });
    })
    .catch(err => {
      console.log("error while getting home details", err);
      res.redirect("/home-list");
    });
};

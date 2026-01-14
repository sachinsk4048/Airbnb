const home = require("../modals/homes");
const fs = require('fs');

exports.getaddhome = (req, res, next) => {
  res.render("host/edit-home", {
    pagetitle: "add home to airbinb",
    editing: false,
    currentPage: "addHome" ,  
    isLoggedIn: req.isLoggedIn,
    user : req.session.user,

  });
};

exports.getedithome = (req, res, next) => {
  const homeid = req.params.homeid;
  const editing = req.query.editing === "true";
  home.findById(homeid).then((home) => {
    if (!home) {
      console.log("home not found for editing ");
      return res.redirect("/host/host-home-list");
    }
    res.render("host/edit-home", {
      home: home,
      pagetitle: "Edit your home",
      editing: editing,
      currentPage: "addHome",   
      isLoggedIn: req.isLoggedIn,
      user : req.session.user,
    });
  });
};

exports.gethosthome = (req, res, next) => {
  home.find().then((registerhome) => {
    res.render("host/host-home-list", {
      registerhome: registerhome,
      title: "host home list",
      currentPage: "host-homes",   
      isLoggedIn: req.isLoggedIn,
      user : req.session.user,
    });
  });
};

exports.postaddhome = (req, res, next) => {
  const { id, homename, price, location, rating, discription } = req.body;
  console.log(id, homename, price, location, rating, discription);
  console.log(req.file);

  if(!req.file){
    console.log("no file provided");
    return res.status(422).send("no image provided")
  }
  
  const photo = req.file.path
  const newhome = new home({
    id,
    homename,
    price,
    location,
    rating,
    photo,
    discription,
  });
  newhome.save().then(() => {
    console.log("home saved successfuly");
  });
  res.redirect("/host/host-home-list");
};

exports.postedithome = (req, res, next) => {
  const { id, homename, price, location, rating, discription } = req.body;
  home.findById(id)
    .then((home) => {
      home.id = id;
      home.homename = homename;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.discription = discription;


      if(req.file){
        fs.unlink(home.photo,(err)=>{
          if(err){
            console.log("error while deleting file :",err);
          }
        });
        home.photo =  req.file.path;
      }

      home
        .save()
        .then((result) => {
          console.log("home updated", result);
        })
        .catch((err) => {
          console.log("error while updating", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("error while finding home", err);
    });
};

exports.postdeletehome = (req, res, next) => {
  const homeid = req.params.homeid;
  home
    .findByIdAndDelete(homeid)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("error while deleting ", error);
    });
};

exports.notfound = (req, res, next) => {
  res.status(404).render("notfound");
  
};

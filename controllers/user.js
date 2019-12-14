
var Model= require('../model/user');


exports.signup = function(req, res){
  Model.findOne({username:req.body.user.username},function(err,user){    
    console.log(req.body.user.password);
    console.log(req.body.confirmPass);
    if(user === null){
      if(req.body.user.password == req.body.confirmPass){  
        Model.create(req.body.user,function(err,newuser){
          if(!err){
            console.log('Successful');
            res.redirect('/login');
          }else{
            console.log(err);
          }
        })
      }else{
        var popup = {confPass:true}
        res.render('signup',{popup:popup});
        console.log("Password do not match");
      }
    }else{
      console.log("Already have an account. Please go to login page");
      var newuser = req.body.user;
      console.log(newuser);
    
      var popup = {duplicateUser:true}
      res.render('signup',{popup:popup,newuser:newuser});
    }
  });
}

exports.signin = function(req,res){
    console.log(req.body);

    Model.findOne({username:req.body.username},function(err,user){
        if(user == null){          
          console.log('No Such User');
          var popup1 = {incorrectuser:true}
          res.render('login',{popup1:popup1});
        }else{
          if(user.authenticate(req.body.password)){
            res.cookie('id',user._id, { expires: new Date(Date.now() + 1800000), httpOnly: true });
            res.cookie('firstname',user.firstname, { expires: new Date(Date.now() + 1800000), httpOnly: true });
            res.cookie('isLoggedIn',true)
            res.redirect('/');
          }else{
            console.log('Incorrect Password');
            var popup1 = {incorrectpassword:true}
            res.render('login',{popup1:popup1});
          }
        }
    })
}

exports.renderHome = (req,res)=>{
  Model.find({},(err,users)=>{
    let author = {};
    // console.log('here')
    if(req.cookies.firstname != undefined){ 
      author = {authorname:req.cookies.firstname,id:req.cookies.id}  }
      else{
     author = {authorname:"Not Logged In",id:"null"}
    }

    if(!err){
      console.log(author)
      res.render('home',{users,author:author})
    }
  })
}

exports.userData = (req,res) =>{
  Model.findOne({_id:req.params.id},(err,data)=>{
    let author = {};
    console.log(req.cookies.firstname,req.cookies.id)
    if(req.cookies.firstname != undefined){ 
      author = {authorname:req.cookies.firstname,id:req.cookies.id}  }
      else{
     author = {authorname:"Not Logged In",id:"null"}
    }
    let user = {
      id:data._id,
      firstname: data.firstname,
      lastname:data.lastname,
      username: data.username,
      currentEmp:(data.currentEmp)?(data.currentEmp):["No Employment History Available"],
      study:(data.study)?(data.study.split('|')):["No Study History Available"],
      publications:(data.publications)?(data.publications.split('|')):["No Publications Available"],
      research:(data.research)?(data.research.split('|')):["No research History Available"],
      activity:(data.activity)?(data.activity.split('|')):["No activity History Available"],
      membership:(data.membership)?(data.membership.split('|')):["No membership History Available"],
    }

    res.render('show',{user,author})
    
  })
}

exports.updateUser = (req,res) =>{
  Model.findOne({_id:req.params.id},(err,user)=>{
    let author = {};
    console.log(req.cookies.firstname,req.cookies.id)
    if(req.cookies.firstname != undefined){ 
      author = {authorname:req.cookies.firstname,id:req.cookies.id}  }
      else{
     author = {authorname:"Not Logged In",id:"null"}
    }
    console.log(user)
    res.render('update',{user,author})
    
  })};

  exports.updateUserPost = function(req,res) {
    req.body.newUser.userId = req.cookies.id
    Model.findOneAndUpdate({_id:req.params.id},req.body.newUser,(err,user)=>{
      if(!err){
        res.redirect(`/user/${user._id}`)
      }else{
        console.log(err);
      }
    })
  }

exports.signout = function(req,res){
  res.clearCookie("id");
  res.clearCookie("firstname");
  res.redirect('/login');
}

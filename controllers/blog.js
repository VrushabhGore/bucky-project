var Model= require('../model/blog');

exports.requireSignin = (req,res,next) => {
    if(!req.cookies.id){  
       res.redirect('/login');
    }else{
        next();
    }
}
exports.renderHome = (req,res) => {
    Model.find({},function(err,blogs){
      blogs.firstname = req.cookies.firstname;
      res.render('home',{blogs:blogs})
    })
}

exports.createBlog = function(req, res){
  if(!req.cookies.id){  
    res.redirect('/login');
  }else {
    let blog = req.body.blog;
    blog.userId = req.cookies.id;
    Model.create(blog,function(err,blogs){
      if(!err){
        res.redirect('/');
      }else{
        console.log(err);
      }
    })
  }
}

exports.showSingleBlog = function(req,res){
  Model.find({_id:req.params.id},function(err,blogs){
    if(err){
      res.redirect('/')
    }else{
      blogs.firstname = req.cookies.firstname;
      if(req.cookies.id == blogs[0].userId){
        blogs[0].isauthor = true;
      }else{
        blogs[0].isauthor = false;
      }
      res.render('show',{blogs:blogs})
    }
  })
}

exports.showYourBlog = function(req,res){
  if(!req.cookies.id){  
    res.redirect('/login');
  }else {
    Model.find({userId:req.cookies.id},function(err,blogs){
      if(err){
        res.redirect('/')
      }else{
        blogs.firstname = req.cookies.firstname;
        res.render('showOwn',{blogs:blogs})
      }
    })
  }
}


exports.deletePost = function(req,res){
  Model.deleteOne( {_id:req.params.id}, function(err){
    if(!err){
      console.log('Deleted');
      res.redirect('/');
    }
    else{
      console.log(err);
    }
  })
}


exports.updateBlogget = function(req,res){
  Model.findOne({_id:req.params.id},(err,blogs)=>{
    if(!err){
      blogs.firstname = req.cookies.firstname;
      res.render('update',{blogs:blogs})
    }else{
      console.log(err);
    }
  })
}

exports.updateBlog = function(req,res) {
  req.body.newblog.userId = req.cookies.id
  Model.findOneAndUpdate({_id:req.params.id},req.body.newblog,(err,blog)=>{
    if(!err){
      res.redirect(`/blog/${blog._id}`)
    }else{
      console.log(err);
    }
  })
}
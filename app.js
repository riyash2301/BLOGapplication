var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
//var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
 
var app = express();
 app.use(bodyParser.urlencoded({ extended:true}));
 app.set("view engine","ejs");
 //app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
//MONGOOSE CONNECTED TO .JS FILE
mongoose.connect("mongodb://localhost/blog_app");

// MONGOOSE SCHEMA CREATED
var blogSchema=new mongoose.Schema({
title: String,
image : String ,
body : String,
created :{ type: Date , default: Date.now}

});
// MODEL CREATED 
var Blog=mongoose.model("Blog", blogSchema);
//  Blog.create({
//      title : "FLOWERS" ,
//      image : "https://pixabay.com/get/57e6dd4b4953b108f5d084609620367d1c3ed9e04e50744f7d2d7ad2954fc6_340.jpg" ,
//      body : "these are pretty colorful flowers"
//  });
 
//RESTFUL ROUTES
app.get("/", function(req, res){
      res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err , allBLog){
        if(err)
        { console.log(err);
        } else{
            res.render("index", {blogs: allBLog});
        }
    }); 
 });
 // NEW ROUTE
 app.get("/blogs/new", function(req,res){
       res.render("new");
 
 });

 //CREATE ROUTE
 app.post("/blogs" , function(req,res){

     Blog.create(req.body.blog , function(err , newBlog){
    if(err)
    {
         res.render("new");
    } else{
        // redirect to index
        res.redirect("/blogs");
    }
    
   }); 
 });
//SHOW ROUTE -- show all the info about object
app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id , function(err , foundblog){
        if(err)
       {
         res.redirect("/blogs");
        }else{
            res.render("show" , { blog : foundblog});
        }
   });
 
});

//EDIT ROUTE -- edit the info about objects
app.get("/blogs/:id/edit", function(req,res)
{
    Blog.findById(req.params.id , function(err , foundblog){
        if(err)
       {
         res.redirect("/blogs");
        }else{
            res.render("edit" , { blog : foundblog});
        }
   });
 
   
});

//UPDATE ROUTE -- 

app.put("/blogs/:id" , function(req,res)
{
  //  req.body.blog.body= req.sanitize(req.body.blog.body)
  
 Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , upDatedBlog){
   if(err){
       res.redirect("/blogs");
   }
   else{
       res.redirect("/blogs/"+ req.params.id);
   }
 });
});
//DELETE ROUTE -- delete a id
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
   });

});
app.listen(3000, function(req,res){
   console.log("BLOG APP STARTED");
});
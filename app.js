// //jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose  = require("mongoose");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://aroradeepak0817:Deepak%40123@cluster0.fixgorz.mongodb.net/toDoListDB');

const itemSchema = {
  name:String

};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name:"Welcome to your todolist!"
});

const item2 = new Item({
  name:"Hit the + button to add a new item"
});
const item3 = new Item({
  name:"<-- Hit this to delete an item."
});


const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

const day = date.getDate();

Item.find({}).then(function(foundItems){
  // console.log(foundItems);
  if(foundItems.length === 0)
  {
    Item.insertMany(defaultItems)
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
  }
  else
  {
    res.render("list", {listTitle: day, newListItems:foundItems});

  }

})
 .catch(function(err){
  console.log(err);
});


});

app.post("/", function(req, res){
  // console.log(req.body);
  const itemName = req.body.newItem;

  const item = new Item({
    name : itemName
  });
  item.save();

  res.redirect("/");
 
});
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId)
    .then(function (){
      console.log("successfully deleted");
      res.redirect("/");
    })
    .catch(function(err){
      console.log(err);
    });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});




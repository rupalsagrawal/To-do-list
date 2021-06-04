//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
const itemsSchema={
  name:String
};
const listSchema={
  name:String,
  items:[itemsSchema]
}
const List =mongoose.model("List",listSchema);
//creating model..
const Item =mongoose.model("Item",itemsSchema)
const item1=new Item({
  name:"welcome to your todolist!"
});
const item2=new Item({
  name:"Hit the button to strike off a item"
});
const defaultItems=[item1,item2];
//Item.insertMany(defaultItems,function(err){
  //if(err){console.log(err);}
  //else
  //console.log("Items inserted");
//});
//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

app.get("/", function(req, res) {

//const day = date.getDate();
Item.find({},function(err,foundItems){
  //console.log(foundItems);
  if(foundItems.length==0)
  { console.log("true");
    Item.insertMany(defaultItems,function(err){
      if(err){console.log(err);}
      else
      console.log("Items inseted");
    });
    res.redirect('/');
  }
  else
  {console.log("false");res.render("list",{listTitle:'Today',newListItems:foundItems});}
});

  //res.render("list", {listTitle: "Today", newListItems: items});

});
app.get('/:listName',function(req,res)
{ console.log('in get route /:listname') ;
  const listName=req.params.listName;
  console.log(listName);
  List.findOne({name:listName},function(err,list)
{  //console.log(list);
    if(list)
    { //Item.find({},function(err,foundItems){
       res.render("list",{listTitle:listName,newListItems:list.items});
      //res.render('/'+listName);
    }
    else
    {
      const newList=new List({name:listName,items:defaultItems});
      newList.save();
      res.render("list",{listTitle:newList.name,newListItems:newList.items});
    }
});

});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName= req.body.listName;
  console.log(itemName);
  console.log(listName);
  if(listName==="Today")
  {
    const newitem=new Item(
      {
        name:itemName
      });
    newitem.save();
      res.redirect('/');
  }
  else
  {
  const newitem=new Item(
    {
      name:itemName
    });
    List.findOne({name:listName},function(err,list)
  { console.log(list);
    list.items.push(newitem);
    list.save();
    res.redirect('/'+listName);
  });
}
    //newitem.save();
  //  res.redirect('/'+listName);

});
app.post('/delete',function(req,res){
  const id=req.body.id;
  const listName=req.body.listName;
  //console.log(req.body.id);
  if(listName==="Today")
  {
    Item.findByIdAndRemove(id,function(err)
  { if(err)
    {console.log("item not deleted");}
    else
    {console.log("item deleted");}
    res.redirect('/');

  });
  }
  //the sam ething can be done by using for loop or filter method also
  else
  {
      List.findOneAndUpdate(
      {name:listName},
      {$pull:{items:{_id:id}}},function(err,foundList){
        if(!err)
        res.redirect('/'+listName);
      });


      //if(!err)
      //res.redirect('\'+listName);
    }




  //console.log(req.body);
});
  //if (req.body.list === "Work") {
    //workItems.push(item);
    //res.redirect("/work");
  //} else {
    //items.push(item);
    //res.redirect("/");
//  }


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

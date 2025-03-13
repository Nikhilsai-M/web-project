const express = require('express');  
const app = express();  
const port = 3000;  
const path=require('path');

app.set('view engine', 'ejs');  
app.use(express.json());
 
app.use(express.static(path.join(__dirname,'public')));  
app.use(express.urlencoded({extended:true}));
 
app.get('/', (req, res) => {  
  res.render("homepage")  
});  
app.get('/sell-phone',(req,res) => {
  res.render("sell_phone")
})
app.get('/sell-laptop',(req,res) => {
  res.render("sell_laptop")
})
app.get('/sell-laptop-models',(req,res) => {
  res.render("sell-laptop-models")
})
app.get('/Accessories',(req,res) => {
  res.render("accessories")
})
app.get('/sell-phone-models',(req,res) => {
  res.render("sellphone-container")
})
app.get('/buy-phone',(req,res) => {
  res.render("buy_phone")
})
app.get('/chargers',(req,res)=>{
  res.render("chargers")
})
app.get('/earbuds',(req,res)=>{
  res.render("earpods")
})
app.get('/mouses',(req,res)=>{
  res.render("mouse")
})
app.get('/smartwatches',(req,res)=>{
  res.render("smartwatch")
})
app.listen(port);
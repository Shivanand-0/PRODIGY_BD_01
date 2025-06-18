// dependencies requirment
const express= require("express");
const { v4: uuidv4 } = require('uuid');
let users = require('./userData');
const validator = require('validator');

// initialise
const app= express();
app.use(express.urlencoded({ extended: true}))

// middleware

const newUserValidation=(req,resp,next)=>{
    let {name,email,age}=req.body;
    if(!name || !email || !age||Number.isNaN(Number(age)) || !validator.isEmail(email)){
        return resp.status(400).send("bad request! invalid input")
    }
    next();
}

const updateUserValidation=(req,resp,next)=>{
    let {name,email,age}=req.body;
    if(email && !validator.isEmail(email)){
        return resp.status(400).send("bad request! invalid input")
    }
    if(age && Number.isNaN(Number(age))){
        return resp.status(400).send("bad request! invalid input")
    }
    next();
}


// routes
app.get("/",(req,resp)=>{
    resp.send("At Home Route!!!");
});

// c:create
app.post("/users/newuser",newUserValidation,(req,resp)=>{
    let {name,email,age}=req.body;
    users.push(
        {
            id:uuidv4(),
            name:name,
            email:email,
            age:age
        }
    );
    console.log(users)
    resp.send("User created...")
})
// r:read
app.get("/users",(req,resp)=>{
    resp.json(users)
});

app.get("/users/:id",(req,resp)=>{
    let id=req.params.id;
    for(let user of users){
        if(user.id === id){
            return resp.json(user);
        }
    }
    resp.status(400).send("user not found")
})
// u:update
app.put("/users/:id/updateuser",updateUserValidation,(req,resp)=>{
    let {name,email,age}=req.body;
    for(let user of users){
        if(user.id === req.params.id){
            console.log("prev user: ",user)
            user.name=name?name:user.name;
            user.email=email?email:user.email;
            user.age=age?age:user.age;
            console.log("updated user: ",user)
            return resp.send("user info updated...")
            
        }
    }
    resp.status(404).send("user not found");
})

// d:delete
app.delete("/users/:id/deleteuser",(req,resp)=>{
    let newUsers=users.filter((user)=>(user.id!=req.params.id))
    if(users.length==newUsers.length){
        resp.status(400).send("user not found");
    }else{
        users=newUsers;
        resp.send("Deletion Successfully");
    }
    
})

app.all("/{*any}",(req,resp)=>{
    resp.send("404 Error")
})


app.listen(8080,()=>{console.log("Server is on port 8080....")});
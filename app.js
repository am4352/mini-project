const express = require("express")
const app = express();
const cookieparser = require("cookie-parser")
const userModel = require("./models/user")
const postModel = require("./models/post")
const bcrypt = require("bcrypt")
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken")
app.use(express.json());
app.use(cookieparser());


app.get("/", (req, res) => {
     res.render("index")    
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", async(req, res) => {
    let { name, username, email, password,age } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
       return res.send("user already exist");
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            const user = userModel.create({
                name, 
                username,
                email, 
                password:hash,
                age, 
            })
            let token = jwt.sign({ email: email, userid: user._id }, "anuj")
            res.cookie("token", token , {httpOnly:true}) 
            res.send("user saved successfully")
        });
    });
 
})

app.post("/login", async(req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.send("something went wrong")
    }
    
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "anuj")
            res.cookie("token", token)
            res.status(200).render("profile") 
       }
       else {
            return res.send("cant login")
      }
               
    })

})

app.listen(3000, () => {
    console.log("server started");   
})

















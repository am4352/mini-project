const express = require("express")
const app = express();
const cookieparser = require("cookie-parser")
const userModel = require("./models/user")
const postModel = require("./models/post")
const bcrypt = require("bcrypt")
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());



app.get("/", (req, res) => {
     res.render("index")    
})


app.post("./register", async(req, res) => {
    let { name, username, email, password, } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
       return res.send("user already exist");
    }
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
            const user = userModel.create({
                name, 
                username,
                email, 
                password:hash,
                age, 
            })
              user.save()
        });
    });
     res.send("user saved successfully")

})








app.listen(3000, () => {
    console.log("server started");   
})

















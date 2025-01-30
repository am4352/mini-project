const express = require("express")
const app = express();
const cookieparser = require("cookie-parser")
const userModel = require("./models/user")
const postModel = require("./models/post")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

const path = require("path")
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken")
app.use(express.json());
app.use(cookieparser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // all the data is present in file
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, fn)
        })       
    }
})

const Upload = multer({ storage: storage })

app.get("/", (req, res) => {
     res.render("index")    
})


app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/profile", (req, res) => {
    res.render("profile")
})

app.get("/test", (req, res) => {
    res.render("test")
})
app.post("/upload", Upload.single("text"), (req, res) => {
    console.log(req.file);    // req.body is only available in post method
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
    let { email, password , name } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        return res.send("something went wrong")
    }
    
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "anuj")
            res.cookie("token", token)
            res.status(200).render("profile", {user}) 
       }
       else {
            return res.send("cant login")
      }
               
    })

})
app.post("/post", async (req, res) => {
    
    let { email, password} = req.body;
    console.log("Request Body:", req.body);
    console.log("Email received:", req.body.email); 
    let user = await userModel.findOne({email});
    if (!user) {
        return res.status(404).send("User not found"); // Send error if user is not found
    }
    let { content } = req.body;
    let post = await postModel.create({ 
        user: user_id,
        content
    });
  user.posts.push(post._id)
    await user.save();
   res.render("profile" ,{user})

})
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.render("index")
})

app.listen(3000, () => {
    console.log("server started");   
})

















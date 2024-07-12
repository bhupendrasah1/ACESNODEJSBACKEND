require("dotenv").config()

const express = require("express")
const connectToDb = require("./database/databaseConnection")
const Blog = require("./model/blogModel")
const bcrypt = require("bcrypt")
const User = require("./model/userModel") 
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')

const app = express()
// const multer = require("./middleware/multerConfig").multer
// const storage = require("./middleware/multerConfig").storage

app.use(cookieParser())

const { multer, storage } = require('./middleware/multerConfig')
const { get } = require("mongoose")
const isAuthenticated = require("./middleware/isAuthenticated")
const upload = multer({ storage: storage })

connectToDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.set('view engine', 'ejs')

app.get("/", async (req, res) => {
    const blogs = await Blog.find().then((result)=>{
        res.render("./blog/home", { blogs: result })
    }) 
})

app.get("/about", (req, res) => {
    const name = "Manish Basnet"
    res.render("about.ejs", { name })
})
app.get("/createblog", isAuthenticated,(req, res) => {
    res.render("./blog/createBlog")
})
app.get("/createblog", (req, res) => {
    res.render("./blog/createBlog")
})
app.get("/deleteblfog/:id", async (req, res) => {
    const id = req.params.id
    await Blog.findByIdAndDelete(id)
    res.redirect("/")
})
app.get("/Editblog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("edit.ejs", { blog })
})
app.post("/registerblog", async (req, res) => {
    const { username, email, password, name } = req.body
    await User.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12),
        name,
    })
    res.redirect("/loginblog")
})
app.get("/loginblog", async (req, res) => {
    // const id = req.params.id
    // const blog = await Blog.findById(id)
    res.render("login.ejs")
})
app.get("/registerblog", (req, res) => {
    res.render('register.ejs')
})
app.post("/loginblog", async (req, res) => {
   const { username, password } = req.body
   const user = await User.find({ username: username })
   console.log(user)
   if (user.length == 0) {
       res.send("Invalid username")
    } else {
        const isMatched = bcrypt.compareSync(password, user[0].password)
        if (!isMatched) {
            res.send("Invalid password")
        } else {
            const token=jwt.sign({userId:user[0]._id}, process.env.SECRET,
                {expiresIn:'20d'}
            )
            res.cookie("token",token)
            res.send("logged in successfully")
        }
    }
}
)
app.post("/Editblog/:id", upload.single('image'), async (req, res) => {
    const id = req.params.id
    const { title, subtitle, description } = req.body
    // console.log(title,subtitle,description)

    if (req.file) {

        await Blog.findByIdAndUpdate(id, {
            title,
            subtitle,
            description,
            image: req.file.filename
        })
    } else {
        await Blog.findByIdAndUpdate(id, {
            title,
            subtitle,
            description,
        })
    }
    res.redirect("/blog/" + id)
})

app.get("/blog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("./blog/blogs.ejs", { blog })
})

app.post("/createblog", upload.single('image'), async (req, res) => {
    // const title = req.body.title 
    // const subtitle = req.body.subtitle 
    // const description  = req.body.description 
    const fileName = req.file.filename
    const { title, subtitle, description } = req.body
    // console.log(title,subtitle,description)

    await Blog.create({
        title,
        subtitle,
        description,
        image: fileName
    })
    res.send("Blog created successfully")
})
app.get("/blog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("./blog/singleBlog")
})

app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id
    const blog = await Blog.findById(id)
    res.render("./blog/singleBlog",{blog})
})

app.get("/deleteblog/:id",async (req,res)=>{
    const id = req.params.id 
    await Blog.findByIdAndDelete(id)
    res.redirect("/")
})


app.get("/editblog/:id",async (req,res)=>{
    const id = req.params.id
    // const {id} = req.params 
  const blog =   await Blog.findById(id) 
    res.render("./blog/editBlog",{blog})
})

app.post("/editblog/:id",async (req,res)=>{
    const id = req.params.id 
    const {title,subtitle,description} = req.body 
    await Blog.findByIdAndUpdate(id,{
        title : title, 
        subtitle : subtitle, 
        description : description
    })
    res.redirect("/blog/" + id)
})

app.get("/register",(req,res)=>{
    res.render("./authentication/register")
})
app.get("/login",(req,res)=>{
    res.render("./authentication/login")
})

app.post("/register",async (req,res)=>{
    const {username,email,password} = req.body 
   await User.create({
        username : username, 
        email : email, 
        password : bcrypt.hashSync(password,12)
    })
    res.redirect("/login")
})

app.post("/login",async (req,res)=>{
    const {email,password} = req.body 
  const user = await User.find({email : email})

  if(user.length
     === 0){
    res.send("Invalid email")
  }else{
    // check password now 
    const isMatched = bcrypt.compareSync(password,user[0].password)
    if(!isMatched){
        res.send("Invalid password")
    }else{
        // require("dotenv").config()
        
        const token = jwt.sign({userId : user[0]._id},process.env.SECRET,{
            expiresIn : '20d'
        })
        res.cookie("token",token)
        res.send("logged in successfully")
    }
  }

})

app.use(express.static("./storage"))
app.use(express.static("./public"))


app.listen(3000, () => {
    console.log("Nodejs project has started at port" + 3000)
})






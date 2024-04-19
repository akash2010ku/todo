const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')

const app = express();
const jwtToken = "123456";

app.use(cors());

mongoose.connect("mongodb+srv://akash2010ku:FljbGsdwBeVtXdVK@cluster0.dbg7a4t.mongodb.net/")

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
});


const todoSchema = new mongoose.Schema({
    title: String,
    description: String, 
});

const Mytodo = mongoose.model("Mytodo", todoSchema);

app.use(express.json());



app.post("/signUp", async (req, res) => {
    try {
        const { name, email, password } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ msg: "User already exists" });
        }


        const newUser = new User({
            name: name,
            email: email,
            password: password
        });


        await newUser.save();


        res.json({ msg: "User created successfully" });
    } catch (err) {

        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});






app.post("/signIn", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(403).json({ msg: "Invalid credentials" });
        }
        const token = jwt.sign({ email: user.email }, jwtToken);
        return res.json({ token });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});




app.use(express.json());

app.post("/addTodo", async(req, res) => {
    try {
    const todo = new Mytodo({
        title: req.body.title,
        description: req.body.description 
    });

    await todo.save();
    res.json({ msg: "todo created successfully" });
}catch (err){
    console.error(err);
        res.status(500).json({ msg: "Server error" });
}

   
});

app.get("/getTodo", async(req, res) => {

const data= await Mytodo.find({});
res.send(data)
});


app.delete("/deleteTodo",async(req,res)=>{
    const id=req.params.id;
  const data= await Mytodo.deleteOne({_id:id})
   res.send(data)

})







app.listen(3000, () => {
    console.log("listening on port 3000")
})
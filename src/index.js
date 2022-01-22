const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
require('./db/connect');
const Register = require('./models/registers')

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,'../public');
const template_path = path.join(__dirname,'../templates/views');
const partial_path = path.join(__dirname,'../templates/partials');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));

app.set('view engine','hbs');
app.set("views",template_path);
hbs.registerPartials(partial_path);

app.get('/', (req,res) => {
    res.render('index.hbs');
});

app.get('/register', (req,res) => {
    res.render('register');
})
app.get('/login', (req,res) => {
    res.render('login');
})

app.post('/register', async(req,res) => {
    try{
        
        // const password = res.body.password;
        // const confirmpassword = res.body.confirmpassword;
        // if(password === confirmpassword){
            const registerEmployee = new Register({
                fullname : req.body.fullname,
                username : req.body.username,
                email : req.body.email,
                phonenumber : req.body.phonenumber,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword,
            })
            const registered = await registerEmployee.save();
            res.status(201).render('index');
        // }else{
        //     res.send('Password are not matching');
        // }
    }catch(error){
        res.status(400).send(error);
    }
})

app.post('/login', async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        
        if(useremail.password === password){
            res.status(201).render('index');
        }else{
            res.send('Password are not matching');
        }
    } catch (error) {
        res.status(400).send('invalid email');
    }
})

app.listen(port,() => {
    console.log(`Server is running at port localhost:${port}`);
});
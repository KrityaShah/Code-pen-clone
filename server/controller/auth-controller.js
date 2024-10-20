const User = require('../model/user-model');
const bcrypt = require('bcryptjs')

// Home page:
const home = async (req, res) => {
    try {
        return res
        .status(200)
        .send("Welcome to home using controller");
    } catch (error) {
        console.error(error);
        
    }
   
}

// Registration:

const register = async (req, res) =>{
    try {

        const {username, password, email, phone } = req.body;

        const userExist = await User.findOne({email})

        if(userExist){
            return res
            .status(400)
            .json({Message: "Email already Exist!"});
        }

        const saltRound = 10;
        const hash_password = await bcrypt.hash(password, saltRound);

        const userCreated = await User.create({username, password : hash_password, email, phone});

        res
        .status(201)
        .json({Message: "Registration Sucessfull!", token: await userCreated.generateToken(), userId: userCreated._id.toString()});
    } catch (error) {
        console.error(error);
        
    }
}


// Login

const login = async (req, res) =>{
    try {
        const {email, password } = req.body;
        
        const userExist = await User.findOne({email});

        if(!userExist){
            return res
            .status(400)
            .json({message: "Invalid credential"})
        }

        
        const isPasswordValid  = await bcrypt.compare(password, userExist.password);

        if(isPasswordValid ){
            res.status(200).json({
                message: "Login sucessfull",
                token : await userExist.generateToken(),
                userId: userExist._id.toString(),
            })
        }else{
            res.status(401).json({message: "invalid Credentail"});
        }

    } catch (error) {
        console.error(error);
        
    }
}


module.exports = {home, register, login};
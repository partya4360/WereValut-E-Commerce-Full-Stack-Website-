const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}


//या function  मुळे User Create केला जातो
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        //या line मुळे User अगोदर exists आहे काय check  केलं जात
        const exisitingUser = await User.findOne({ email });
        if (exisitingUser) {
            return res.status(400).json({ message: 'User Already Exists' })
        }

        //User Enter केलेला password Hash केला जातो
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = User.create({ name, email, password: hashedPassword });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const message = `
            Welcome to WereValut, ${name}! Thank  You for registering with us.
            We are excited to have you as part of our community.
            To complete your registration , 
            Your OTP for WereValut Registration ${otp} `;

            await sendEmail({
                email,
                subject: 'Welcome to WereValut - Your OTP for Registration',
                message
            });


            res.status(201).json({
                _id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

//Login User
const loginUser = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))){
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else{
            res.status(400).json({message:'Invalid email or password'});
        }
    }catch(error){
        res.status(500).json({message: 'Server Error'});
    }
};

const getUsers = async (req, res)=>{
    try{
        const users = await User.find({}).select('-password');
        res.json(users);
    }catch(error){
        res.status(500).json({message:'Server Error'});
    }
};

module.exports = {registerUser, loginUser, getUsers};
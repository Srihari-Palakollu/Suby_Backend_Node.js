const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
dotEnv.config();

const secretKey = process.env.WHATISYOURNAME;

const vendorRegister = async (req, res) =>{
    const {username, password, email} = req.body;
    try {
        const vendorEmail = await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).send("Email already existed")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            password: hashedPassword,
            email
        });
        await newVendor.save();

        res.status(201).json({message: "Vendor register successfully"})
    } catch (error) {
        res.status(500).json({error: "internal server error"})
    }
}


const vendorLogin = async (req, res) =>{
    const {email, password} = req.body;
    try {
        const vendor = await Vendor.findOne({email});
        const comparePassword = await bcrypt.compare(password, vendor.password);
        if (!vendor || !comparePassword){
            return res.status(400).json({error: "invalid username or password"})
        }
        const token = jwt.sign({vendorId: vendor._id}, secretKey)

        res.status(200).json({message: "vendor login successfully", token})
        console.log(email)
    } catch (error) {
        res.status(500).json({error})
    }
}

const getAllVendors = async(req, res) =>{
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "internal server error"})
    }
}

const getSingleVendor = async (req, res) =>{
    const vendorId = req.params.id;
    try{
        const vendor = await Vendor.findById(vendorId);
        if (!vendor){
            return res.status(400).json({error: "vendor not found"})
        }
        return res.status(200).json({vendor})
    }catch(error){
        console.log(error)
        return res.status(401).json({error})
    }
}
 
module.exports = {vendorRegister, vendorLogin, getAllVendors, getSingleVendor}
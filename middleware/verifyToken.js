const Vendor = require('../models/Vendor');
const dotEnv = require('dotenv');
const jwt = require('jsonwebtoken');

dotEnv.config();

const secretKey = process.env.WHATISYOURNAME;

const verifyToken = async (req, res, next) =>{
    const token = req.headers.token

    if (!token){
        return res.status(401).json({error: "token required"})
    }

    try {
        const decode = jwt.verify(token, secretKey)
        const vendor = await Vendor.findById(decode.vendorId);

        if (!vendor){
            return res.status(401).json({error: "vendor not found"})
        }

        req.vendorId = vendor._id;
        next()


    } catch (error) {
        return res.status(401).json({error})
        
    }

}

module.exports = verifyToken;
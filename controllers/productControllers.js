const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage:storage})

const addProduct = async (req, res) =>{
    try {
        const {productName, price, category, bestseller, description} = req.body;
        const image = req.file ? req.file.filename: undefined
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId);
        if (!firm){
            return res.status(401).json({error: 'firm not found'})
        }

        const product = new Product({
            productName, price, category, bestseller, description, image, firm: firm._id
        })
        const saveProduct = await product.save()
        firm.product.push(saveProduct)
        await firm.save() 
        res.status(200).json(saveProduct)

    } catch (error) {
        console.error(error)
        return res.status(500).json({error})
    }
}

const getProductsByFirm = async (req, res) =>{
    try {
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)
        if (!firm){
            return res.status(401).json({error: "firm not fount"})
        }
        const restarntname = firm.firmName;
        const products = await Product.find({firm: firmId})
        return req.status(200).json({restarntname,products})
    } catch (error) {
        console.error(error)
        return res.status(401).json({error})
    }
}

const deleteProduct = async (req, res) =>{
    try {
        const productId = req.params.productId;
        const product = await Product.findByIdAndDelete(productId);
        if (!product){
            return res.status(400).json({error: "product not found"})
        }
    } catch (error) {
        return req.status(401).json({error: "internal server error"})
    }
}

module.exports = {addProduct: [upload.single('image'), addProduct], getProductsByFirm, deleteProduct};
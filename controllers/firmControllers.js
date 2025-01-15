const Firm = require('../models/Firm');
const multer = require('multer');
const Vendor = require('../models/Vendor');
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

const addFirm = async (req, res) =>{
    try {
        const {firmName, area, category, region, offer} = req.body;
        const image = req.file? req.file.filename: undefined;
        const vendor = await Vendor.findById(req.vendorId)
        if (!vendor){
            return res.status(401).json({error: "vendor not found"});
        }
        const firm = new Firm({
            firmName, area, category, region, offer, image, vendor: vendor._id
        });

        const saveFirm = await firm.save();

        vendor.firm.push(saveFirm); 

        await vendor.save()

        return res.status(200).json({message: 'firm added successfully'})

    } catch (error) {
        return res.status(400).json({error});
    }
}

const deleteFirm = async (req, res) =>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findByIdAndDelete(firmId);
        if (!firm){
            return res.status(400).json({error: "fiem not found"})
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({error: "internal server error"});
    }
}

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirm};

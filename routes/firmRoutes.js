const firmController = require('../controllers/firmControllers');
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
 
const router = express.Router();

router.post('/add-firm', verifyToken, firmController.addFirm);
router.get('/uploads/:imageName', (req, res) =>{
    const imageName = req.params.imageName;
    res.headersSent('content-Type', 'image/jpeg');
    res.sendFile(Path2D.join(__dirname, '..', 'uploads', imageName))
})
router.delete('/:firmId', firmController.deleteFirm);

module.exports = router;
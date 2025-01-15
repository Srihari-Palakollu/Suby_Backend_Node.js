const productController = require('../controllers/productControllers');
const express = require('express');
const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductsByFirm);
router.get('/uploads/:imageName', (req, res) =>{
    const imageName = req.params.imageName;
    res.headersSent('content-Type', 'image/jpeg');
    res.sendFile(Path2D.join(__dirname, '..', 'uploads', imageName))
});

router.delete('/:productId', productController.deleteProduct);

module.exports = router;



const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const vendorRoutes = require('./routes/vendorRoutes');
const mongoose = require('mongoose');
const PORT = 4000;
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRouters = require('./routes/productRoutes');
const path = require('path');

dotEnv.config();
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Database is running successfully"))
.catch((error) => console.log(error));

app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRouters)
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () =>{
    console.log(`Server is runnig at ${PORT}`);
});

app.use('/home', (req, res) =>{
    res.send("Welcome to suby")
})
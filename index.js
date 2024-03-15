const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Cors = require('cors')
require('dotenv').config()
const mong = require('mongoose');
const auth = require('./Routes/auth')
const configs = require('./Routes/PriceConfig')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(Cors());

app.use('/api/auth',auth);
app.use('/api/price-configs',configs);
app.listen(process.env.PORT,()=>{
    mong.connect(process.env.MongoDB_URL).then(()=>{
        console.log('Connected to DB');
        console.log(`Server is running at http://localhost:${process.env.PORT}`)
    })
})
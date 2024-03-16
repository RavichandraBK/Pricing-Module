const express = require('express')
const router = express.Router();
const Price = require('../Models/PriceConfig')
router.post('/calculate-price/:userId/:configId',async(req,res)=>{
    try {
        const {distance, duration} = req.body;
        const {userId ,configId} = req.params;
        
        const getConfig = await Price.findOne({userId, 'configs._id':configId});
        const calConfig = getConfig.configs[0];
        if(!calConfig){
            res.status(404).json({message:'Configuaration not found'})
        }
        if(calConfig.enabled){
            const totalPrice = ((calConfig.distanceBasePrice+(distance*calConfig.distanceAdditionalPrice))+(duration*calConfig.timeMultiplierFactor)+calConfig.waitingCharges);
            res.json({message:'Calculation Successful',totalPrice});
            return
        }
        
        res.json({calConfig})
    } catch (err) {
        console.log('Couldnt do the calculation',err);
        res.status(500).json("Soemthing went wrong");
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Price = require('../Models/PriceConfig')
router.get('/get-price-config', async (req, res) => {
    try {
        const getPricesConfig = await Price.find({ configs });
        if (getPricesConfig.length === 0) {
            res.status(404).json({ message: 'There are no configurations, kindly create one' });
        } else {
            res.json({ message: 'All configs', PriceConfig: getPricesConfig });
        }
    } catch (err) {
        console.error('Could not get configs, something went wrong:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

router.post('/add-price-config/:userId',async(req,res)=>{
    try {
        const {configs:newConfig} = req.body;
        const {userId} = req.params;
        console.log(req.body)
        const existingUsr = await Price.findOne({userId});
        console.log(existingUsr)
        if(!existingUsr){
            // const addConfig = await Price.create({userId,configs:[{distanceBasePrice:newConfig.dbp, distanceAdditionalPrice:newConfig.dap,timeMultiplierFactor:newConfig.tmf,waitingCharges:newConfig.wc,daysOfWeek:newConfig.weekdays}]});
            const addConfig = await Price.create({userId,configs:[newConfig]});
            res.json({message:'Successfully created the configuaration',configId:addConfig.configs[0]?._id});
            return
        }
        

            const existingConfig = existingUsr.configs.some(obj =>{ 
               return Object.values(obj).every((value, index) => {
                    const otherValue = Object.values(newConfig)[index];
                    if (Array.isArray(value) && Array.isArray(otherValue)) {
                        return value.length!==otherValue.length?false:value.every((value, index) => value === otherValue[index]);;
                    }
                    return value === otherValue;
                });
     
});
            console.log("existingConfig",existingConfig)
        if(existingConfig){
            res.json({message:'Configurartion already existing , please use it or create different one'});
        }
        else{
            // const updatedConfig = await Price.findOneAndUpdate({userId},{$push:{configs:[{distanceBasePrice:newConfig.dbp, distanceAdditionalPrice:newConfig.dap,timeMultiplierFactor:newConfig.tmf,waitingCharges:newConfig.wc,daysOfWeek:newConfig.weekdays}]}},{new:true})
            const updatedConfig = await Price.findOneAndUpdate({userId},{$push:{configs:[newConfig]}},{new:true})
            const configId = updatedConfig.configs[updatedConfig.configs.length-1]?._id;
            res.json({message:'Price configuration added successfully',configId});
        }
    } catch (err) {
        console.log('Couldnt add price config, something went wrong',err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.put('/edit-config/:userId/:configId', async (req, res) => {
    try {
        const {  updatedConfig } = req.body;
        const {userId, configId} = req.params;
        const updatedUser = await Price.findOneAndUpdate(
            { userId, 'configs._id': configId }, 
            { $set: { 'configs.$': updatedConfig } }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User or config not found' });
        }

        res.status(200).json({ message: 'Config updated successfully', updatedUser });
    } catch (err) {
        console.error('Could not update config, something went wrong:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/remove-config/:userId/:configId', async (req, res) => {
    try {
        const {userId, configId} = req.params;

        const updatedUser = await Price.findOneAndUpdate(
            { userId },
            { $pull: { configs: { _id: configId } } }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Config removed successfully', updatedUser });
    } catch (err) {
        console.error('Could not remove config, something went wrong:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
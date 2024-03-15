const mong = require('mongoose')

const Price = mong.model('price',{
    userId:mong.Schema.Types.ObjectId,
    configs:[{ distanceBasePrice: {
        type: Number,
        required: true
      },
      distanceAdditionalPrice: {
        type: Number,
        required: true
      },
      timeMultiplierFactor: {
        type: Number,
        required: true
      },
      waitingCharges: {
        type: Number,
        required: true
      },
      daysOfWeek: {
        type: [String],
        required: true
      },
      enabled: {
        type: Boolean,
        default: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }}],
   
  })

module.exports = Price;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const   BillSchema = new Schema({
  shop_id: { type: 'String', required: false },
  shop_name: { type: 'String', required: false },
  title: { type: 'String', required: true },
  path: { type: 'String', required: false }, 
  date: { type: 'String', required: false },  
 
 flag:{type:'String' ,required:false} 
 
           


});

module.exports = mongoose.model('bills', BillSchema);

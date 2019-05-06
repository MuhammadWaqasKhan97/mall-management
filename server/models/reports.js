const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const   ReportSchema = new Schema({
  title: { type: 'String', required: true },
  path: { type: 'String', required: false }, 
  date: { type: 'String', required: false },  
  flag:{type:'String' ,required:false} 

});

module.exports = mongoose.model('reports', ReportSchema);

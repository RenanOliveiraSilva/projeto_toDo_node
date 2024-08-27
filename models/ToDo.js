const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    data: {type: Date, default: Date.now},
    dataTo: {type: Date, required: true},
    status: {type: String, default: 'Pendente'}

})

module.exports = mongoose.model('ToDo', ToDoSchema);
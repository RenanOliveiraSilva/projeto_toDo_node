
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/atividades');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Conexão com o banco de dados
mongoose.connect("mongodb://localhost:27017/ToDo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => console.log("Conexão com o MongoDB realizada com sucesso!"))
.catch(err => console.log("Erro: " + err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Rotas
app.use('/', indexRouter); //Rota Principal
app.use('/cadastrar', indexRouter); //Rota para cadastrar nova tarefa
app.use('/editar', indexRouter); //Rota para editar a tarefa

//Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

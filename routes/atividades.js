const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const ToDo = require('../models/ToDo');
const { isAfter, isEqual, parseISO, format } = require('date-fns');

const moment = require('moment-timezone');

const { ptBR } = require("date-fns/locale");


const testDate = '2024-08-07T00:00:00.000+00:00';

const timeZone = 'America/Sao_Paulo';

//Rota para listar todos as atividades
router.get('/', async (req, res) => {
  try {
      const atividades = await ToDo.find();

      // Formate a data para cada atividade antes de passar para o template
      atividades.forEach(atividade => {
          console.log(atividade.dataTo)
          const formattedDateUTC = moment.utc(atividade.dataTo).format('DD/MM/YYYY HH:mm:ss');
          atividade.dataFormatada = format(formattedDateUTC, 'dd/MM/yyyy', { locale: ptBR });
      });
      res.render("index", { atividades });

  } catch (err) {
      res.status(500).send(err.message);
  }
});

//Rota para o formulário de cadastro
router.post('/', function(req, res) {
  const nomeTarefa = req.body.nomeTarefa;
  res.render('atividadeCadastro.ejs', { nomeTarefa });

});

//Rotas para cadastrar nova tarefa
router.post('/inserir', async(req, res) => {
  const { nome, dataTo } = req.body;
  try{
    const novaTarefa = new ToDo({nome, dataTo });
    await novaTarefa.save();
    res.redirect("/");
  } catch(err) {
    res.status(500).send(err.message);
  }
})

//Rota para editar a tarefa
router.get('/editar/:id', async(req, res) => {
  try {
    const tarefa = await ToDo.findById(req.params.id);
    res.render("editarTarefa", { tarefa, format, ptBR });
  } catch (err) {
    res.status(500).send(err.message);
  }
})

//Rota para atualizar a tarefa
router.post('/atualizar/:id', async(req, res) => {
  const { nome, dataTo,status } = req.body;
  try {
    await ToDo.findByIdAndUpdate(req.params.id, { nome, dataTo, status });
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
})

//Rota para deletar a tarefa
router.get("/deletar/:id", async(req, res) => {
  const { id } = req.params;
  try {
    await ToDo.deleteOne({_id: new ObjectId(id)});
    res.redirect("/");

  } catch(err) {
    res.status(500).send(err.message);
  }
})

// Rota para concluir a tarefa
router.get('/concluir/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await ToDo.findByIdAndUpdate(id, { status: 'Concluída' });
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
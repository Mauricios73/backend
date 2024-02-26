const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = express.Router();

// app.use(bodyParser.json());

//________________LOGIN__________________

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

routes.post('/users', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // const user = users.find(user => user.email === email && user.password === password);
    const user = await User.findOne({ email, password });

    if (user) {
      return res.status(200).json(user);
    }
    return res.status(401).json({ message: 'Credenciais inválidas' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//______________AGENDAMENTOS______________

const FormModel = mongoose.model('agendamentos', {
  name: String,
  phone: String,
  email: String,
  date: Date
});

routes.post('/agendamentos', (req, res) => {
  const { name, phone, email, date } = req.body;

  const formData = new FormModel({
    name,
    phone,
    email,
    date
  });

  formData.save()
    .then(() => {
      console.log('Os dados foram salvos.');
      res.status(200).json({ message: 'Os dados foram salvos.' });
    })
    .catch(err => {
      console.log('Erro ao salvar os dados:', err);
      res.status(500).json({ error: 'Erro ao salvar os dados.' });
    });
});

routes.get('/teste', (req, res) => {
  res.send('Esta é uma rota de teste');
});

module.exports = routes; 
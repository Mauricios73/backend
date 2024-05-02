const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = express.Router();
const bcrypt = require('bcryptjs');

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
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res.status(200).json(user);
      } else {
        return res.status(401).json({ message: 'Senha incorreta!' });
      }
    }

    return res.status(401).json({ message: 'Credenciais inválidas2' });
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

//______________Rota de teste______________

routes.get('/', (req, res) => {
  res.send(
    `<h1>Bem vindo ao meu site!</h1>
    <p>Aqui você pode agendar uma consulta com um de nossos especialistas.</p>

    <p>Para agendar uma consulta, basta preencher o formulário abaixo.</p>`
  );
});

//______________SingUp______________


routes.post('/newusers', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado!' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
    const newUser = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json(newUser); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = routes; 
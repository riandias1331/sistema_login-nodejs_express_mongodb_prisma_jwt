const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;


// Rotas públicas
exports.renderHome = (req, res) => {
  res.render('home.html');
};

exports.getregister = (req, res) => {
  res.render('register');
};

exports.getlogin = (req, res) => {
  res.render('login');
};

// Rotas privadas
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Registrar usuário
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).render('register', { error: 'Email já está em uso' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "1h" });

    console.log(user);
    res.status(201).json({ token }); // Envia o token como resposta JSON
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(400).render('register', { error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Senha inválida');
      return res.status(400).render('login', { error: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "1h" });

    console.log('Login bem-sucedido:', user);
    res.status(200).json({ token }); // Envia o token como resposta JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deletar todos os usuários (protegido)
exports.deletedUserAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado para deletar.' });
    }

    await prisma.user.deleteMany();
    res.status(200).json({ message: 'Todos os usuários foram deletados.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
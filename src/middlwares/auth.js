const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;
console.log('JWT Secret:', jwt_secret); // Adicione esta linha para verificar o segredo JWT

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }

    req.user = user;
    next();
  });
};
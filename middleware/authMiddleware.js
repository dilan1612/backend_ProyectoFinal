const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret'); // Usa una clave predeterminada si JWT_SECRET no está definido
    req.user = verified; // Agrega los datos decodificados al objeto `req`
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;

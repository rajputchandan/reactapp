const jwt = require('jsonwebtoken');

exports.protectSuperAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied: Not Super Admin' });
    }

    req.user = decoded; // Attach user data (id, email, etc.) to request
    next();
  } catch (err) {
    console.error("Super Admin Token Error:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

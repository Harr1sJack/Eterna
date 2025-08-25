import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'No token, access denied' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
}

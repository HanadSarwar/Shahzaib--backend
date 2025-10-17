const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Missing Authorization header' });
	}

	const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
	jwt.verify(token, jwtSecret, (err, payload) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid or expired token' });
		}
		req.user = payload;
		next();
	});
};



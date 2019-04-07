// let's go!
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

// spinup graphql yoga server
const server = createServer();
// TODO: Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());
// TODO: Use Express middleware to populate current user

// DECODE THE JWT to get user on each request!
server.express.use((req, res, next) => {
	const { token } = req.cookies;
	if (token) {
		const { userId } = jwt.verify(token, process.env.APP_SECRET);
		req.userId = userId;
	}
	next();
});

// Apply User onto each request
server.express.use(async (req, res, next) => {
	// if they aren't logged in, skip this
	if (!req.userId) return next();
	const user = await db.query.user({ where: { id: req.userId } }, '{ id, name, email, permissions}');
	req.user = user;
	next();
});

// startup server
server.start(
	{
		cors: {
			credentials: true,
			origin: process.env.FRONTEND_URL,
		},
	},
	deets => {
		// make clickable link to port
		console.log(`Server is Now running on Port http:/localhost:${deets.port}`);
	}
);

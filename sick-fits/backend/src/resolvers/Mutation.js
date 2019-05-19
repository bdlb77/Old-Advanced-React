const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');
const Mutations = {
	async createItem(parent, args, ctx, info) {
		// TODO Check if they are logged in
		if (!ctx.request.userId) {
			throw new Error('You Must be logged in to do that!');
		}
		// ctx is established in the createServer..
		// ctx is a promise.. so async/await for it to be resolved
		// info has the actual query.. so stx.database.mutation needs to be passed to back-end
		const item = await ctx.db.mutation.createItem(
			{
				data: {
					// this is how we create a relationship for item <=> user
					user: {
						connect: {
							id: ctx.request.userId,
						},
					},
					...args,
				},
			},
			info
		);

		return item;
	},
	updateItem(parent, args, ctx, info) {
		const updates = { ...args }; // take copy of all data in updates
		delete updates.id;
		// remove the id from the updates as to NOT update the id
		// RUN UPDATE METHOD
		// ctx -> context in request
		// db -> expose Prisma DB, mutation..
		return ctx.db.mutation.updateItem({
			data: updates,
			where: {
				id: args.id,
			},
			info,
			/* updateItem is expecting us to return an item so 'info' is 
       reference to query that contains that item */
		});
	},
	async deleteItem(parent, args, ctx, info) {
		const where = { id: args.id };
		// find item -> since this is an additional query => pure graphql instead of 'info'
		// we need to modify slightly the result of item..
		const item = await ctx.db.query.item({ where }, `{id title user{ id }}`);
		// if they own item / permissions (TODO)
		const ownsItem = item.user.id === ctx.request.userId;
		const hasPermissions = ctx.request.user.permissions.some(permission => {
			['ADMIN', 'ITEMDELETE'].includes(permission);
		});

		if (!ownsItem && !hasPermissions) {
			throw new Error("YOU DON'T HAVE THE PERMISSION FOR THAT!");
		}
		// delete it
		return ctx.db.mutation.deleteItem({ where }, info);
	},

	async signup(parent, args, ctx, info) {
		// 1. lowercase email address
		args.email = args.email.toLowerCase();
		// 2. check password (change to hash)
		// also use SALT (.., 10) => Completely Unique Hash
		const password = await bcrypt.hash(args.password, 10);
		// 4. run mutation for createUser
		const user = await ctx.db.mutation.createUser(
			{
				data: {
					...args,
					password,
					permissions: { set: ['USER'] },
				},
			},
			info //so it knows what data to return to client!
		);
		// 3. create token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// set token in the cookies on the response
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, // cookie for 1 year
		});
		// FINALLY return user
		return user;
	},

	async signin(parent, { email, password }, ctx, info) {
		// 1. check user email
		const user = await ctx.db.query.user({ where: { email } });
		if (!user) {
			throw new Error(`A user doesn't exist  with email ${email}`);
		}
		// 2. validate password
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error(`Invalid Password!`);
		}
		// 3. set jwt token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// 4. set cookie with token
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, // cookie for 1 year
		});
		// 5. return user
		return user;
	},

	signout(parent, args, ctx, info) {
		ctx.response.clearCookie('token');
		return { message: 'Goodbye!' };
	},

	async requestReset(parent, args, ctx, info) {
		// check if real user
		const user = await ctx.db.query.user({ where: { email: args.email } });
		if (!user) {
			throw new Error(`A user doesn't exist  with email ${args.email}`);
		}
		// 2. set reset token on that expiry
		const randomBytesPromise = promisify(randomBytes);
		const resetToken = (await randomBytesPromise(20)).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
		const response = await ctx.db.mutation.updateUser({
			where: { email: args.email },
			data: { resetToken, resetTokenExpiry },
		});
		// 3. email them reset token
		const mailRes = await transport.sendMail({
			from: 'bry@bry.com',
			to: user.email,
			subject: 'Your Password Reset Token',
			html: makeANiceEmail(
				`Your password reset token is here!\n\n
			    <a href="${process.env.FRONTEND_URL}/reset?${resetToken}">
				    Click Here to Reset
			    </a>
				`
			),
		});
		// 4. return the message
		return { message: 'Thanks!' };
	},

	async resetPassword(parent, args, ctx, info) {
		// 1. check if passwords match
		if (args.password !== args.confirmPassword) {
			throw new Error('Your Passwords do not match!');
		}
		// 2. check if legit token ... grab 1st user where USERS
		// 3. check if it's expired
		const [user] = await ctx.db.query.users({
			where: {
				resetToken: args.resetToken,
				resetTokenExpiry_gte: Date.now() - 3600000,
			},
		});
		if (!user) {
			throw new Error('Invalid / Expired Reset Token!');
		}
		// 4. hash new password
		const password = await bcrypt.hash(args.password, 10);
		// 5. save new password to user + remove old reset token fields
		const updatedUser = await ctx.db.mutation.updateUser({
			where: { email: user.email },
			data: { password, resetToken: null, resetTokenExpiry: null },
		});
		// 6. generate jwt
		const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
		// 7. set jwt cookie
		ctx.response.cookie('token', token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 365, // cookie for 1 year
		});
		// 8. return new user
		return updatedUser;
	},

	async updatePermissions(parent, args, ctx, info) {
		// 1. Check if they're logged in
		if (!ctx.request.userId) throw new Error('Must be logged in!');
		// 2. Query current user

		const currentUser = await ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
		// 3. check if they have any permissions to do this!
		hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
		// 4. update permissions
		// pass WHATdata that needs to be updated -> where (WHERE data needs to be update)
		// set NEEDS to b eused since Permissions is a custom defined datatype
		return ctx.db.mutation.updateUser(
			{
				data: {
					permissions: {
						set: args.permissions,
					},
				},
				// args of the userId that is from the updated user which MAY NOT be current user.
				where: {
					id: args.userId,
				},
			},
			info
		);
	},
};

module.exports = Mutations;

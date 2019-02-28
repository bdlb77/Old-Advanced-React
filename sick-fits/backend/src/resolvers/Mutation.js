const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mutations = {
	async createItem(parent, args, ctx, info) {
		// TODO Check if they are logged in
		// ctx is established in the createServer..
		// ctx is a promise.. so async/await for it to be resolved
		// info has the actual query.. so stx.database.mutation needs to be passed to back-end
		const item = await ctx.db.mutation.createItem(
			{
				data: {
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
		const item = await ctx.db.query.item({ where }, `{id title}`);
		// if they own item / permissions (TODO)
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
};

module.exports = Mutations;

// where DB calls will go / API calls/ CSV parses / etc

// if query from prisma is Same as query here.. you can do this =>
const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

// const Query = {
//     items: forwardTo('db')
// }

const Query = {
	// async items(parent, args, ctx, info) {
	// 	const items = await ctx.db.query.items();

	// 	return items;
	// },
	items: forwardTo('db'),
	item: forwardTo('db'),
	itemsConnection: forwardTo('db'),
	me(parent, args, ctx, info) {
		// 1. check if current user exists
		if (!ctx.request.userId) {
			return null;
		}
		return ctx.db.query.user(
			{
				where: { id: ctx.request.userId },
			},
			info
		);
	},
	async users(parent, args, ctx, info) {
		// 1. check if user logged in?
		if (!ctx.request.userId) {
			throw new Error('You must be logged in!');
		}
		console.log(ctx.request.userId);
		// 2. Check if the user has the permissions to query all the users
		hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

		// 2. if they do, query all the users!
		return ctx.db.query.users({}, info);
	},
};

module.exports = Query;

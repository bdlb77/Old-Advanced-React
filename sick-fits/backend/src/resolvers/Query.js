// where DB calls will go / API calls/ CSV parses / etc

// if query from prisma is Same as query here.. you can do this =>
const { forwardTo } = require('prisma-binding');
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
};

module.exports = Query;

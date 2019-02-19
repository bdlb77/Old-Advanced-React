const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO Check if they are logged in
    // ctx is established in the createServer..
    // ctx is a promise.. so async/await for it to be resolved
    // info has the actual query.. so stx.database.mutation needs to be passed to back-end
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
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
        id: args.id
      },
      info
      /* updateItem is expecting us to return an item so 'info' is 
       reference to query that contains that item */
    });
  }
};
module.exports = Mutations;

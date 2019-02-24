import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { AllItemsQuery, ALL_ITEMS_QUERY } from './Items';
const DELETE_ITEM_MUTATION = gql`
	mutation DELETE_ITEM_MUTATION($id: ID!) {
		deleteItem(id: $id) {
			id
		}
	}
`;

class DeleteItem extends Component {
	// have access to update() options from Apollo!
	update = (cache, payload) => {
		// 1. manually update cache and update on client so it matches server
		// console.log(data, payload);

		// 2. Read the cache and delete correct Item!
		const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
		data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
		// 3. put items back!
		cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
	};
	render() {
		return (
			<Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }} update={this.update}>
				{(deleteItem, { error }) => (
					<button
						onClick={() => {
							if (confirm('Are you sure you want to delete?')) {
								deleteItem();
							}
						}}
					>
						{this.props.children}
					</button>
				)}
			</Mutation>
		);
	}
}
export default DeleteItem;

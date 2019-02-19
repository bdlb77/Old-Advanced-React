import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

// function that takes in variable called title.. when it's called
// run mutation crateItem.. and used the $title variable as title
// any variable passed in ex: **title**: String can be used as $title in the query
/* mutation CREATEITEMMUTATION(title: String!){
  createItem(
    title: $title
  ){
    id
  }
}
*/

// This mutation takes 5 args.. and we use the $title..etc.. as the variables for the args
// and we want to return id of the item
const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			price
		}
	}
`;
const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
		updateItem(id: $id, title: $title, description: $description, price: $price) {
			id
		}
	}
`;

class UpdateItem extends Component {
	state = {};

	handleChange = e => {
		const { name, type, value } = e.target;
		// now take const val and check if the input is a number.. coerce to int
		const val = type === 'number' ? parseFloat(value) : value;
		// the [name] -> computed property names from the name (e.target.name)..  which returns the name of the input
		this.setState({ [name]: val });
	};

	updateForm = async (e, updateItemMutation) => {
		e.preventDefault();
		console.log('Updating!!');
		const res = await updateItemMutation({
			variables: {
				id: this.props.id,
				...this.state,
			},
		});
		return;
	};
	render() {
		// Wrap the whole Form in a Mutation Component... the variables to be passed are this.state
		// Mutation takes mutation and variables as properties
		// Always inside Query/Mutation.. you must run a function.. so it's (mutationfunction, payload)
		// change mutationfunction for createItem(just the name of the func)
		// destructure payload to loading and error
		return (
			<Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
				{({ data, loading }) => {
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No Item found for id: {this.props.id}</p>;
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
							{(updateItem, { loading, error }) => (
								<Form onSubmit={e => this.updateForm(e, updateItem)}>
									<ErrorMessage error={error} />
									{/* if loading true.. disabled and aria-busy will be activated */}
									{/* fieldset is great because it takes a disabled value! */}
									{/* Check the aria-busy in the css styles for the cool keyframe */}
									<fieldset disabled={loading} aria-busy={loading}>
										<label htmlFor="title">
											Title
											<input
												onChange={this.handleChange}
												type="text"
												id="title"
												name="title"
												placeholder="Title"
												defaultValue={data.item.title}
												required
											/>
										</label>
										<label htmlFor="price">
											Price
											<input
												type="number"
												id="price"
												name="price"
												placeholder="Price"
												defaultValue={data.item.price}
												onChange={this.handleChange}
												required
											/>
										</label>
										<label htmlFor="description">
											Description
											<textarea
												id="description"
												name="description"
												placeholder="Enter a description"
												defaultValue={data.item.description}
												onChange={this.handleChange}
												required
											/>
										</label>
										<button type="submit">Submit</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}
export default UpdateItem;
export { UPDATE_ITEM_MUTATION };

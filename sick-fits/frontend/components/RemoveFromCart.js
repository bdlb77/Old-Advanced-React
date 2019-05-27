import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
	mutation removeFromCart($id: ID!) {
		removeFromCart(id: $id) {
			id
		}
	}
`;
const BigButton = styled.button`
	font-size: 3rem;
	background: none;
	border: 0;
	&:hover {
		cursor: pointer;
		color: ${props => props.theme.blue};
	}
`;

// this gets called as soon as we get a response back from the server after a mutation has been performed
class RemoveFromCart extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
	};
	update = (cache, payload) => {
		// first read cache
		console.log('removing from cache update fn');
		const data = cache.readQuery({ query: CURRENT_USER_QUERY });
		// remove item from the cart
		const cartItemId = payload.data.removeFromCart.id;

		data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
		// write it back to the cache
		cache.writeQuery({ query: CURRENT_USER_QUERY, data });
	};
	render() {
		return (
			<Mutation
				mutation={REMOVE_FROM_CART_MUTATION}
				variables={{ id: this.props.id }}
				update={this.update}
				optimisticResponse={{
					__typename: 'Mutation',
					removeFromCart: {
						__typename: 'CartItem',
						id: this.props.id,
					},
				}}
			>
				{(removeFromCart, { loading, error }) => (
					<BigButton
						onClick={() => {
							removeFromCart().catch(err => alert(err.message));
						}}
						disabled={loading}
						title="Delete Item"
					>
						&times;
					</BigButton>
				)}
			</Mutation>
		);
	}
}

export default RemoveFromCart;

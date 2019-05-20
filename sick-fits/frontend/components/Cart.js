import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';

const LOAD_LOCAL_STATE_QUERY = gql`
	query {
		cartOpen @client
	}
`;
const TOGGLE_CART_MUTATION = gql`
	mutation {
		toggleCart @client
	}
`;
const Cart = () => (
	<Mutation mutation={TOGGLE_CART_MUTATION}>
		{toggleCart => (
			<Query query={LOAD_LOCAL_STATE_QUERY}>
				{({ data }) => (
					<CartStyles open={data.cartOpen}>
						<header>
							<CloseButton onClick={toggleCart} title="close">
								&times;
							</CloseButton>
							<Supreme>Your Cart!</Supreme>
						</header>

						<footer>
							<p>$10.10</p>
							<SickButton>Checkout</SickButton>
						</footer>
					</CartStyles>
				)}
			</Query>
		)}
	</Mutation>
);
export { TOGGLE_CART_MUTATION };
export { LOAD_LOCAL_STATE_QUERY };
export default Cart;

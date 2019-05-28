import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
	mutation createOrder($token: String!) {
		createOrder(token: $token) {
			id
			charge
			total
		}
	}
`;
class TakeMyMoney extends React.Component {
	totalItems = cart => {
		return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
	};

	onToken = async (res, createOrder) => {
		NProgress.start();
		const order = await createOrder({
			variables: {
				token: res.id,
			},
		}).catch(err => alert(err.message));

		Router.push({
			pathname: '/order',
			query: { id: order.data.createOrder.id },
		});
		console.log(order);
	};
	render() {
		return (
			<User>
				{({ data: { me } }) => (
					<Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
						{createOrder => (
							<StripeCheckout
								amount={calcTotalPrice(me.cart)}
								name="Sick Fits!"
								description={`Order of ${this.totalItems(me.cart)} Items`}
								image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
								stripeKey="pk_test_Mf86gLgeAzocrG64ojxkuT5K00J3qlDn5O"
								currency="USD"
								email={me.email}
								token={res => this.onToken(res, createOrder)}
							>
								{this.props.children}
							</StripeCheckout>
						)}
					</Mutation>
				)}
			</User>
		);
	}
}
export default TakeMyMoney;

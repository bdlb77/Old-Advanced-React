import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import styled from 'styled-components';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import Error from './ErrorMessage';

const USER_ORDERS_QUERY = gql`
	query USER_ORDERS_QUERY {
		orders(orderBy: createdAt_DESC) {
			id
			total
			createdAt
			items {
				id
				title
				price
				description
				quantity
				image
			}
		}
	}
`;

const orderUI = styled.ul`
	display: grid;
	grid-gap: 4rem;
	grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;
class OrdersList extends Component {
	static propTypes = {
		prop: PropTypes,
	};

	render() {
		return (
			<Query query={USER_ORDERS_QUERY}>
				{({ data: { orders }, loading, err }) => {
					if (err) return <Error error={err} />;
					if (loading) return <p>loading..</p>;
					console.log(orders);
					return (
						<div>
							<h2>You have {orders.length} Orders!</h2>
							<orderUI>
								{orders.map(order => (
									<OrderItemStyles>
										<Link
											href={{
												pathname: '/order',
												query: { id: order.id },
											}}
										>
											<a>
												<div className="order-meta">
													<p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
													<p>{order.items.length} Products</p>
													<p>
														{formatDistance(Date.parse(order.createdAt), new Date(), {
															awareOfUnicodeTokens: true,
														})}
													</p>
													<p>{formatMoney(order.total)}</p>
												</div>
												<div className="images">
													{order.items.map(item => (
														<img key={item.id} src={item.image} alt={item.title} />
													))}
												</div>
											</a>
										</Link>
									</OrderItemStyles>
								))}
							</orderUI>
						</div>
					);
				}}
			</Query>
		);
	}
}
export default OrdersList;

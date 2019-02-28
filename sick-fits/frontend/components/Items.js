import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';
const Center = styled.div`
	text-align: center;
`;
const ItemsList = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 60px;
	max-width: ${props => props.theme.maxWidth};
	margin: 0 auto;
`;
const ALL_ITEMS_QUERY = gql`
	query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
		items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
			id
			title
			price
			description
			image
			largeImage
		}
	}
`;

class Items extends Component {
	render() {
		return (
			<Center>
				<Pagination page={this.props.page || 1} />
				{/* Only Child of a query component MUST be a function. */}
				<Query
					// fetchPolicy: 'network-only' => REdownload data from server (though takes away from speed)
					query={ALL_ITEMS_QUERY}
					variables={{
						//if page 1 (1*4 - 4) = 0... if page 2 (2*4 - 4) = 4
						skip: this.props.page * perPage - perPage,
						first: perPage,
					}}
				>
					{({ data, error, loading }) => {
						// check error and loading state first!!!
						if (data.error) return <p>{error.message} occurred..</p>;
						if (data.loading) return <p>Loading</p>;
						console.log(data.items);
						return (
							<ItemsList>
								{data.items.map(item => (
									<Item item={item} key={item.id} />
								))}
							</ItemsList>
						);
					}}
				</Query>
				<Pagination />
			</Center>
		);
	}
}
export default Items;
export { ALL_ITEMS_QUERY };

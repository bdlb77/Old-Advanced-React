import React, { useState } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
	query SEARCH_ITEMS_QUERY($searchTerm: String!) {
		items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
			id
			image
			title
		}
	}
`;

function routeToItem(item) {
	Router.push({
		pathname: '/item',
		query: { id: item.id },
	});
}
const AutoComplete = props => {
	const [items, setItems] = useState();
	const [loading, setLoading] = useState(false);

	const handleSearch = debounce(async (e, client) => {
		// Manually query Apollo Client
		setLoading(true);
		const res = await client.query({
			query: SEARCH_ITEMS_QUERY,
			variables: { searchTerm: e.target.value },
		});
		console.log(res);

		setItems(res.data.items);
		setLoading(false);
	}, 350);
	resetIdCounter();
	return (
		<SearchStyles>
			<Downshift onChange={routeToItem} itemToString={item => (item === null ? '' : item.title)}>
				{({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
					<div>
						<ApolloConsumer>
							{client => (
								<input
									{...getInputProps({
										type: 'Search',
										placeholder: 'Search for an item',
										id: 'search',
										className: loading ? 'loading' : '',
										onChange: e => {
											e.persist();
											handleSearch(e, client);
										},
									})}
								/>
							)}
						</ApolloConsumer>
						{isOpen && (
							<DropDown>
								{items &&
									items.map((item, index) => (
										<DropDownItem
											{...getItemProps({
												item,
											})}
											key={item.id}
											highlighted={index === highlightedIndex}
										>
											<img width="50" src={item.image} alt={item.title} />
											{item.title}
										</DropDownItem>
									))}
							</DropDown>
						)}
					</div>
				)}
			</Downshift>
		</SearchStyles>
	);
};
export default AutoComplete;

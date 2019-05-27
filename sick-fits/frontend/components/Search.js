import React, { useState } from 'react';
import Downshift from 'downshift';
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

const AutoComplete = props => {
	const [items, setItems] = useState();
	const [loading, setLoading] = useState(false);

	const handleSearch = debounce(async(e, client) => {
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
	return (
		<SearchStyles>
			<div>
				<ApolloConsumer>
					{client => (
						<input
							type="search"
							onChange={e => {
								e.persist();
								handleSearch(e, client);
							}}
						/>
					)}
				</ApolloConsumer>
				<DropDown>
        {items && items.map(item => <DropDownItem key={item.id} >
          <img width="50" src={item.image} alt={item.title} />
            {item.title}
        </DropDownItem>
          )}
				</DropDown>
			</div>
		</SearchStyles>
	);
};
export default AutoComplete;

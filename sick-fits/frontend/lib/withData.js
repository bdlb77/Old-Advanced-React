// expose high order component of Apollo (essentially front-end DB) via a prop
// for server-side rendering to work
import withApollo from 'next-with-apollo';
// apollo-boost is a package that contains many boilerplate packages of Apollo.. 1 stop shop essentially
import ApolloClient from 'apollo-boost';
import { LOAD_LOCAL_STATE_QUERY } from '../components/Cart';
import { endpoint } from '../config';

function createClient({ headers }) {
	return new ApolloClient({
		uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
		// on every request... include the credentials -> if any logged-in cookies.. it'll be brought along
		request: operation => {
			operation.setContext({
				fetchOptions: {
					credentials: 'include',
				},
				headers,
			});
		},
		// Local Data
		clientState: {
			resolvers: {
				Mutation: {
					toggleCart(_, variables, { cache }) {
						// read the cache
						const { cartOpen } = cache.readQuery({
							query: LOAD_LOCAL_STATE_QUERY,
						});
						// take out carOpen.. flip it.
						const data = {
							data: {
								cartOpen: !cartOpen,
							},
						};
						// put back in cache
						cache.writeData(data);
						return data;
					},
				},
			},
			defaults: {
				cartOpen: false,
			},
		},
	});
}
// createClient -> done in App.js
export default withApollo(createClient);

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
// Own Render Prop Component
const CURRENT_USER_QUERY = gql`
	query {
		me {
			id
			name
			email
			permissions
		}
	}
`;

const User = props => (
	<Query {...props} query={CURRENT_USER_QUERY}>
		{payload => props.children(payload)}
	</Query>
);
// to know that Props children will ALWAYS be a function that is passed.
User.propTypes = {
	children: PropTypes.func.isRequired,
};
export { CURRENT_USER_QUERY };
export default User;

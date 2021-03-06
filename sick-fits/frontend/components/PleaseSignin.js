import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const PleaseSignin = props => (
	<Query query={CURRENT_USER_QUERY}>
		{({ data, loading }) => {
			if (loading) return <p>loading...</p>;
			if (!data.me) {
				return (
					<>
						<p>Please Sign In.</p>
						<Signin />
					</>
				);
			}
			return props.children;
		}}
	</Query>
);
export default PleaseSignin;

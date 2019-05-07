import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';
import { compareAsc } from 'date-fns';

const ALL_USERS_QUERY = gql`
	query {
		users {
			id
			name
			email
			permissions
		}
	}
`;

const possiblePermissions = ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMUPDATE', 'ITEMDELETE', 'PERMISSIONUPDATE'];
const Permissions = props => (
	<Query query={ALL_USERS_QUERY}>
		{({ data, loading, error }) =>
			console.log(data) || (
				<div>
					<Error error={error} />
					<div>
						<h2>Manage User Permissions</h2>
						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									{possiblePermissions.map(p => (
										<th key={p}>{p}</th>
									))}
									<th>UPDATE</th>
								</tr>
							</thead>
							<tbody>
								{data.users.map(user => (
									<UserPermissions user={user} key={user.id} />
								))}
							</tbody>
						</Table>
					</div>
				</div>
			)
		}
	</Query>
);

class UserPermissions extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			name: PropTypes.string,
			email: PropTypes.string,
			id: PropTypes.string,
			permissions: PropTypes.array,
		}).isRequired,
	};
	/* 
NORMALLY A HUGE NONO!! 
however since we want to set initial state of this  component and have Permissions
already showing checked on render, it is okay.
1. Setting permissions as initial state
2. Handle state update in component
3. 

*/
	state = {
		permissions: this.props.user.permissions,
	};
	handlePermissionChange = e => {
		const checkbox = e.target;
		let updatedPermissions = [...this.state.permissions];
		// console.log(updatedPermissions);
		// remove / add permissions
		if (checkbox.checked) {
			updatedPermissions.push(checkbox.value);
		} else {
			// filter(keep) if permission is not the checkbox value!!
			updatedPermissions = updatedPermissions.filter(perm => perm !== checkbox.value);
		}
		this.setState({ permissions: updatedPermissions });
	};
	render() {
		const user = this.props.user;
		return (
			<tr>
				<td>{user.name}</td>
				<td>{user.email} </td>
				{possiblePermissions.map(per => (
					<td key={per}>
						<label htmlFor={`${user.id}-permission-${per}`}>
							<input
								type="checkbox"
								checked={this.state.permissions.includes(per)}
								onChange={this.handlePermissionChange}
								value={per}
							/>
						</label>
					</td>
				))}
				<td>
					<SickButton>Update</SickButton>
				</td>
			</tr>
		);
	}
}

export default Permissions;

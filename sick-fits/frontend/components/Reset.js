import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
const RESET_PASSWORD_MUTATION = gql`
	mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
		resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
			id
			email
			name
		}
	}
`;
class RequestReset extends Component {
	static PropTypes = {
		resetToken: PropTypes.string.isRequired,
	};
	state = {
		password: '',
		confirmPassword: '',
	};
	saveToState = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	render() {
		return (
			<Mutation
				mutation={RESET_PASSWORD_MUTATION}
				variables={{
					resetToken: this.props.resetToken,
					password: this.state.password,
					confirmPassword: this.state.confirmPassword,
				}}
				refetchQueries={[{ query: CURRENT_USER_QUERY }]}
			>
				{(reset, { loading, error, called }) => {
					return (
						<Form
							method="post"
							onSubmit={async e => {
								e.preventDefault();
								const res = await reset();
								console.log({ res });
								this.setState({ password: '', confirmPassword: '' });
							}}
						>
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Reset your Password!</h2>
								<Error error={error} />
								<label htmlFor="password">
									Password
									<input
										type="password"
										name="password"
										value={this.state.password}
										onChange={this.saveToState}
									/>
								</label>
								<label htmlFor="confirmPassword">
									Confirm Password
									<input
										type="password"
										name="confirmPassword"
										value={this.state.confirmPassword}
										onChange={this.saveToState}
									/>
								</label>
								<button type="submit">Reset!</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}
export default RequestReset;

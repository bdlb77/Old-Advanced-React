import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGN_IN_MUTATION = gql`
	mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
		signin(email: $email, password: $password) {
			id
			email
			name
		}
	}
`;
class Signin extends Component {
	state = {
		email: '',
		password: '',
	};
	saveToState = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	render() {
		return (
			<Mutation
				mutation={SIGN_IN_MUTATION}
				variables={this.state}
				refetchQueries={[{ query: CURRENT_USER_QUERY }]}
			>
				{(signin, { loading, error }) => {
					return (
						<Form
							method="post"
							onSubmit={async e => {
								e.preventDefault();
								const res = await signin();
								console.log({ res });
								this.setState({ email: '', name: '', password: '' });
							}}
						>
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Sign In To Your Account!</h2>
								<Error error={error} />
								<label htmlFor="email">
									Email
									<input
										type="email"
										name="email"
										value={this.state.email}
										onChange={this.saveToState}
									/>
								</label>
								<label htmlFor="password">
									Password
									<input
										type="password"
										name="password"
										value={this.state.password}
										onChange={this.saveToState}
									/>
								</label>
								<button type="submit">Sign In!</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}
export default Signin;

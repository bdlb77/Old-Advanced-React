import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGN_UP_MUTATION = gql`
	mutation SIGN_UP_MUTATION($email: String!, $name: String!, $password: String!) {
		signup(email: $email, name: $name, password: $password) {
			id
			email
			name
		}
	}
`;
class SignupPage extends Component {
	state = {
		email: '',
		name: '',
		password: '',
	};
	saveToState = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	render() {
		return (
			<Mutation mutation={SIGN_UP_MUTATION} variables={this.state}>
				{(signup, { loading, error }) => {
					return (
						<Form
							method="post"
							onSubmit={async e => {
								e.preventDefault();
								const res = await signup();
								console.log({ res });
								this.setState({ email: '', name: '', password: '' });
							}}
						>
							<fieldset disabled={loading} aria-busy={loading}>
								<h2>Sign Up!</h2>
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
								<label htmlFor="name">
									Name
									<input
										type="text"
										name="name"
										value={this.state.name}
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
								<button type="submit">Sign up!</button>
							</fieldset>
						</Form>
					);
				}}
			</Mutation>
		);
	}
}
export default SignupPage;

import SignupPage from '../components/SignupPage';
import styled from 'styled-components';

const Columns = styled.div`
	display: grid;
	grid-auto-columns: repeat(auto-fit, minmax(300px, 1fr));
	grid-gap: 20px;
`;
const Signup = props => (
	<div>
		<SignupPage />
		<SignupPage />
		<SignupPage />
	</div>
);

export default Signup;

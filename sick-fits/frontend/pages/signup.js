import styled from 'styled-components';
import SignupPage from '../components/SignupPage';
import Signin from '../components/Signin';

const Columns = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	grid-gap: 20px;
`;
const Signup = props => (
	<Columns>
		<SignupPage />
		<Signin />
	</Columns>
);

export default Signup;

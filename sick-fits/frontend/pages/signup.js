import styled from 'styled-components';
import SignupPage from '../components/SignupPage';
import RequestReset from '../components/RequestReset';
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
		<RequestReset />
	</Columns>
);

export default Signup;

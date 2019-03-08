import Link from 'next/link';
import Reset from '../components/Reset';

const ResetPage = props => (
	<div>
		<p>reset token page! </p>
		<Reset resetToken={props.query.resetToken} />
	</div>
);
export default ResetPage;

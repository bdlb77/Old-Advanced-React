import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import NProgress from 'nprogress';
import Nav from '../components/Nav';
import Cart from '../components/Cart';
import Search from '../components/Search';

//  Routing functions to allow for NProgress bar ! (This is really neat)

Router.onRouteChangeStart = () => {
	NProgress.start();
};
Router.onRouteChangeComplete = () => {
	NProgress.done();
};
Router.onRouteChangeError = () => {
	NProgress.done();
};

const Logo = styled.h1`
	font-size: 4rem;
	margin-left: 2rem;
	position: relative;
	z-index: 2;
	transform: skew(-7deg);
	a {
		padding: 0.5rem 1rem;
		background: ${props => props.theme.blue};
		color: ${props => props.theme.white};
		text-transform: none;
		text-decoration: none;
	}

	@media (max-width: ${props => props.theme.lgBreak}) {
		margin: 0;
		text-align: center;
	}
`;

const StyledHeader = styled.header`
	.bar {
		border-bottom: 10px solid ${props => props.theme.black};
		display: grid;
		grid-template-columns: auto 1fr;
		justify-content: space-between;
		align-items: stretch;
		@media (max-width: ${props => props.theme.lgBreak}) {
			grid-template-columns: 1fr;
			justify-content: center;
		}
	}
	.sub-bar {
		display: grid;
		grid-template-columns: 1fr auto;
		border-bottom: 1px solid ${props => props.theme.lightGray};
	}
`;

const Header = () => (
	<StyledHeader>
		<div className="bar">
			<Logo>
				<Link href="/">
					<a>SICK FITS</a>
				</Link>
			</Logo>
			<Nav />
		</div>
		<div className="sub-bar">
			<Search />
		</div>
		<Cart />
	</StyledHeader>
);
export default Header;

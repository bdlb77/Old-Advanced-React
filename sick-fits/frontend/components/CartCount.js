import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
const Dot = styled.div`
	background: ${props => props.theme.blue};
	color: white;
	border-radius: 50%;
	padding: 0.5rem;
	line-height: 2rem;
	min-width: 3rem;
	margin-left: 1rem;
	font-weight: 100;
	/* If changing from 1 -> 2 2 is so every number will have same width */
	font-feature-settings: 'tnum';
	font-variant-numeric: tabular-nums;
`;
const AnimationStyles = styled.span`
	position: relative;
	.count {
		display: block;
		position: relative;
		transition: all 0.2s;
		backface-visibility: hidden;
	}
	/* Initial State of the entering Dot */
	.count-enter {
		transform: scale(4) rotateX(0.5turn); /* 0.5turns */
	}

	.count-enter-active {
		transform: rotateX(0);
	}

	.count-exit {
		top: 0;
		position: absolute;
		transform: rotateX(0);
	}

	.count-exit-active {
		transform: scale(4) rotateX(0.5turn); /* 0.5turns */
	}
`;

const CartCount = ({ count }) => (
	<AnimationStyles>
		<TransitionGroup>
			<CSSTransition
				unmountOnExit
				className="count"
				classNames="count"
				key={count}
				timeout={{ enter: 200, exit: 200 }}
			>
				<Dot>{count}</Dot>
			</CSSTransition>
		</TransitionGroup>
	</AnimationStyles>
);

export default CartCount;

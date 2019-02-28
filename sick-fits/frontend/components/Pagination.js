import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Link from 'next/link';
import Head from 'next/head';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';
const PAGINATION_QUERY = gql`
	query PAGINATION_QUERY {
		itemsConnection {
			aggregate {
				count
			}
		}
	}
`;
const Pagination = props => (
	<Query query={PAGINATION_QUERY}>
		{({ data, loading, error }) => {
			const count = data.itemsConnection.aggregate.count;
			const pages = Math.ceil(count / perPage);
			const page = props.page;
			if (loading) return <p>loading...</p>;
			return (
				<PaginationStyles>
					<Head>
						<title>
							Sick Fits! {page} of {pages}
						</title>
					</Head>
					<Link
						prefetch
						href={{
							pathname: 'index',
							query: { page: page - 1 },
						}}
					>
						<a className="prev" aria-disabled={page <= 1}>
							Prev
						</a>
					</Link>
					<p>
						page {page} of {pages}
					</p>
					<p>{count} Items Total</p>
					<Link
						prefetch
						href={{
							pathname: 'index',
							query: { page: page + 1 },
						}}
					>
						<a className="next" aria-disabled={page >= pages}>
							Next
						</a>
					</Link>
				</PaginationStyles>
			);
		}}
	</Query>
);

export default Pagination;

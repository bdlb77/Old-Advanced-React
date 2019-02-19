import Link from 'next/link';
import UpdateItem from '../components/UpdateItem';

const Update = ({query}) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);
export default Update;
// can do withRouter(Update) to expose id from params
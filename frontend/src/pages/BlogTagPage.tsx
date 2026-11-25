import { useParams } from 'react-router-dom';
import { BlogPage } from './BlogPage';

export function BlogTagPage() {
  const { tag } = useParams();
  return <BlogPage initialTag={tag ? decodeURIComponent(tag) : ''} />;
}

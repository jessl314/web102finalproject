import { useEffect, useState } from 'react';
import { supabase } from '../client';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false }); // newest first

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.image_url && <img src={post.image_url} alt={post.title} style={{ maxWidth: '100%' }} />}
          <p><strong>Type:</strong> {post.post_type}</p>
          <p><em>Upvotes: {post.upvotes}</em></p>
        </div>
      ))}
    </div>
  );
};

export default Home;

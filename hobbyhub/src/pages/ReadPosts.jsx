import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../client';

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching posts:', error);
      else setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="ReadPosts">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.author}
            content={post.content}
            image_url={post.image_url}
            post_type={post.post_type}
            upvotes={post.upvotes}
            repost_of={post.repost_of}
          />
        ))
      ) : (
        <h2>No Posts Yet 😞</h2>
      )}
    </div>
  );
};

export default ReadPosts;

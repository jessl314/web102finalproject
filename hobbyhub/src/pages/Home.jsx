import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at"); // "created_at" or "upvotes"

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      
      try {
        const { data, error: supabaseError } = await supabase
          .from('Posts')
          .select('*')
          .order('created_at', { ascending: false }); // newest first

        if (supabaseError) {
          console.error('Error fetching posts:', supabaseError);
          setError('Failed to load posts. Please check your connection and try again.');
        } else {
          setPosts(data || []);
          setFilteredPosts(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred while loading posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter and sort posts
  useEffect(() => {
    let filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort posts
    filtered.sort((a, b) => {
      if (sortBy === "upvotes") {
        return b.upvotes - a.upvotes;
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, sortBy]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
      <h3>Loading posts...</h3>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
      <h3>Error</h3>
      <p>{error}</p>
      <p>Please check your Supabase configuration and try again.</p>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'white' }}>Recent Posts</h2>
      
      {/* Search and Sort Controls */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div>
          <input
            type="text"
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              width: '250px'
            }}
          />
        </div>
        
        <div>
          <label style={{ marginRight: '8px', fontSize: '14px', color: 'white' }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="created_at">Creation Time</option>
            <option value="upvotes">Upvotes</option>
          </select>
        </div>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
          <p>No posts found.</p>
          <p>Be the first to create a post!</p>
        </div>
      ) : (
        <div>
          {filteredPosts.map((post) => (
            <div key={post.id} style={{ 
              border: '1px solid #ccc', 
              margin: '10px 0', 
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => window.location.href = `/post/${post.id}`}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              <h3 style={{ color: 'black', marginBottom: '8px' }}>{post.title}</h3>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '14px',
                color: 'white'
              }}>
                <span>
                  Created: {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span>
                  Upvotes: {post.upvotes}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

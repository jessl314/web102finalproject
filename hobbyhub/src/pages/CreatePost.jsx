import { useState } from 'react'
import { supabase } from '../client'
import './CreatePost.css'

const CreatePost = () => {
    const [post, setPost] = useState({title: "", content: "", image_url: "", upvotes: 0, post_type: "Question", repost_of: null})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const createPost = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        // Log the exact data being sent
        const postData = {
            title: post.title, 
            content: post.content, 
            image_url: post.image_url || null, // Convert empty string to null
            upvotes: post.upvotes, 
            post_type: post.post_type, 
            repost_of: post.repost_of ?? null
        };
        
        console.log('Attempting to create post with data:', postData);

        try {
            const { data, error: supabaseError } = await supabase
                .from('Posts')
                .insert(postData)
                .select();

            if (supabaseError) {
                console.error('Supabase error creating post:', supabaseError);
                setError(`Failed to create post: ${supabaseError.message}`);
            } else {
                console.log('Post created successfully:', data);
                window.location = "/"
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError(`An unexpected error occurred: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target
        setPost( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    return (
        <div>
            <h2>Create a New Post</h2>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <form onSubmit={createPost}>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" onChange={handleChange} value={post.title} required /><br />
                <br/>

                <label htmlFor="image">Image URL (optional)</label><br />
                <input type="url" id="image" name="image_url" onChange={handleChange} value={post.image_url}  /><br />
                <br/>

                <label htmlFor="post_type">Post Type:</label><br />
                <label>
                    <input
                    type="radio"
                    name="post_type"
                    value="Question"
                    checked={post.post_type === 'Question'}
                    onChange={handleChange}
                    />
                    Question
                </label>
                <label>
                    <input
                        type="radio"
                        name="post_type"
                        value="Opinion"
                        checked={post.post_type === 'Opinion'}
                        onChange={handleChange}
                    />
                    Opinion
                </label>
                <br />

                <label htmlFor="content">Content</label><br />
                <textarea 
                    rows="5" 
                    cols="50" 
                    id="content" 
                    name="content" 
                    onChange={handleChange} 
                    value={post.content}
                    required
                />
                <br/>
                <input 
                    type="submit" 
                    value={loading ? "Creating..." : "Submit"} 
                    disabled={loading}
                />
            </form>
        </div>
    )
}

export default CreatePost
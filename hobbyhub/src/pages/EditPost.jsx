import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../client'
import './EditPost.css'

const EditPost = () => {
    const { id } = useParams()
    const [post, setPost] = useState({
        title: "", 
        content: "", 
        image_url: "", 
        upvotes: 0, 
        post_type: "Question", 
        repost_of: null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [initialLoading, setInitialLoading] = useState(true)

    // Fetch the post data when component mounts
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error: supabaseError } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (supabaseError) {
                    console.error('Error fetching post:', supabaseError)
                    setError('Failed to load post. Please try again.')
                } else if (data) {
                    setPost(data)
                } else {
                    setError('Post not found.')
                }
            } catch (err) {
                console.error('Unexpected error:', err)
                setError('An unexpected error occurred while loading the post.')
            } finally {
                setInitialLoading(false)
            }
        }

        if (id) {
            fetchPost()
        }
    }, [id])

    const handleChange = (event) => {
        const { name, value } = event.target
        setPost((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const updatePost = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { data, error: supabaseError } = await supabase
                .from('Posts')
                .update({
                    title: post.title,
                    content: post.content,
                    image_url: post.image_url || null,
                    post_type: post.post_type
                })
                .eq('id', id)
                .select()

            if (supabaseError) {
                console.error('Error updating post:', supabaseError)
                setError(`Failed to update post: ${supabaseError.message}`)
            } else {
                console.log('Post updated successfully:', data)
                window.location = "/"
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError(`An unexpected error occurred: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const deletePost = async (event) => {
        event.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { error: supabaseError } = await supabase
                .from('Posts')
                .delete()
                .eq('id', id)

            if (supabaseError) {
                console.error('Error deleting post:', supabaseError)
                setError(`Failed to delete post: ${supabaseError.message}`)
            } else {
                console.log('Post deleted successfully')
                window.location = "/"
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError(`An unexpected error occurred: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h3>Loading post...</h3>
            </div>
        )
    }

    if (error && !post.title) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div>
            <h2>Edit Post</h2>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <form onSubmit={updatePost}>
                <label htmlFor="title">Title</label> <br />
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value={post.title} 
                    onChange={handleChange} 
                    required 
                /><br />
                <br/>

                <label htmlFor="image">Image URL (optional)</label><br />
                <input 
                    type="url" 
                    id="image" 
                    name="image_url" 
                    value={post.image_url} 
                    onChange={handleChange} 
                /><br />
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
                    value={post.content} 
                    onChange={handleChange}
                    required
                />
                <br/>
                <input 
                    type="submit" 
                    value={loading ? "Updating..." : "Update Post"} 
                    disabled={loading}
                />
                <button 
                    type="button"
                    className="deleteButton" 
                    onClick={deletePost}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete Post"}
                </button>
            </form>
        </div>
    )
}

export default EditPost
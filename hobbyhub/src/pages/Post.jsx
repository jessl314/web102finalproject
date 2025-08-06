import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../client'
import './Post.css'

const Post = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [commentError, setCommentError] = useState('')
    const [upvoting, setUpvoting] = useState(false)

    // Fetch post and comments
    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                // Fetch post
                const { data: postData, error: postError } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (postError) {
                    console.error('Error fetching post:', postError)
                    setError('Failed to load post.')
                    return
                }

                setPost(postData)

                // Fetch comments
                const { data: commentsData, error: commentsError } = await supabase
                    .from('Comments')
                    .select('*')
                    .eq('post_id', id)
                    .order('created_at', { ascending: true })

                if (commentsError) {
                    console.error('Error fetching comments:', commentsError)
                    setCommentError(`Comments error: ${commentsError.message}`)
                } else {
                    setComments(commentsData || [])
                }
            } catch (err) {
                console.error('Unexpected error:', err)
                setError('An unexpected error occurred.')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchPostAndComments()
        }
    }, [id])

    const handleUpvote = async () => {
        if (!post || upvoting) return

        setUpvoting(true)
        try {
            const { data, error } = await supabase
                .from('Posts')
                .update({ upvotes: post.upvotes + 1 })
                .eq('id', id)
                .select()

            if (error) {
                console.error('Error upvoting:', error)
            } else {
                setPost(data[0])
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        } finally {
            setUpvoting(false)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            const { data, error } = await supabase
                .from('Comments')
                .insert({
                    post_id: id,
                    content: newComment.trim()
                })
                .select()

            if (error) {
                console.error('Error adding comment:', error)
                setCommentError(`Failed to add comment: ${error.message}`)
            } else {
                setComments([...comments, data[0]])
                setNewComment('')
                setCommentError('') // Clear any previous errors
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setCommentError(`Unexpected error: ${err.message}`)
        }
    }

    const handleDeletePost = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            // First, delete all comments for this post
            const { error: commentsError } = await supabase
                .from('Comments')
                .delete()
                .eq('post_id', id)

            if (commentsError) {
                console.error('Error deleting comments:', commentsError)
                alert(`Failed to delete comments: ${commentsError.message}`)
                return
            }

            // Then delete the post
            const { error: postError } = await supabase
                .from('Posts')
                .delete()
                .eq('id', id)

            if (postError) {
                console.error('Error deleting post:', postError)
                alert(`Failed to delete post: ${postError.message}`)
            } else {
                navigate('/')
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            alert(`Unexpected error: ${err.message}`)
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                <h3>Loading post...</h3>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <h3>Error</h3>
                <p>{error || 'Post not found'}</p>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        )
    }

    return (
        <div className="post-container">
            <div className="post-header">
                <button 
                    onClick={() => navigate('/')}
                    className="back-button"
                >
                    ← Back to Home
                </button>
            </div>

            <div className="post-content">
                <h1 className="post-title">{post.title}</h1>
                
                <div className="post-meta">
                    <span className="post-type">{post.post_type}</span>
                    <span className="post-date">
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="post-upvotes">
                        Upvotes: {post.upvotes}
                    </span>
                </div>

                <div className="post-actions">
                    <button 
                        onClick={handleUpvote}
                        disabled={upvoting}
                        className="upvote-button"
                    >
                        {upvoting ? 'Upvoting...' : '👍 Upvote'}
                    </button>
                    
                    <Link 
                        to={`/edit/${post.id}`}
                        className="edit-button"
                    >
                        Edit Post
                    </Link>
                    
                    <button 
                        onClick={handleDeletePost}
                        className="delete-button"
                    >
                        Delete Post
                    </button>
                </div>

                <div className="post-text">
                    <p>{post.content}</p>
                </div>

                {post.image_url && (
                    <div className="post-image">
                        <img 
                            src={post.image_url} 
                            alt={post.title}
                        />
                    </div>
                )}
            </div>

            <div className="comments-section">
                <h3>Comments ({comments.length})</h3>
                
                {commentError && (
                    <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
                        {commentError}
                    </div>
                )}
                
                <form onSubmit={handleAddComment} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows="3"
                        required
                    />
                    <button type="submit">Add Comment</button>
                </form>

                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p className="no-comments">No comments yet. Be the first to comment!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <div className="comment-header">
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Post 
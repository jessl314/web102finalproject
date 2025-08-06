import { useState } from 'react'
import { supabase } from '../client'

const CreatePost = () => {

    const createPost = async (event) => {
        event.preventDefault();

        await supabase
            .from('Posts')
            .insert({title: post.title, content: post.content, image_url: post.image_url, upvotes: post.upvotes, post_type: post.post_type, repost_of: post.repost_of ?? null})
            .select();

        window.location = "/"
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

    const [post, setPost] = useState({title: "", content: "", image_url: "", upvotes: 0, post_type: "Question", repost_of: null})

    return (
        <div>
            <form  onSubmit={createPost}>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" onChange={handleChange} value={post.title} /><br />
                <br/>

                <label htmlFor="image">Image</label><br />
                <input type="text" id="image" name="image_url" onChange={handleChange} value={post.image_url}  /><br />
                <br/>

                <label htmlFor="post_type">
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
                <textarea rows="5" cols="50" id="content" name="content" onChange={handleChange} value={post.content}>
                </textarea>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default CreatePost
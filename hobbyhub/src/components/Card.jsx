import { useState } from 'react';
import './Card.css';
import more from './more.png';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

const Card = (props) => {
  const [count, setCount] = useState(props.upvotes || 0);

  const updateCount = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from('Posts')
      .update({ upvotes: count + 1 })
      .eq('id', props.id);

    if (!error) {
      setCount((prev) => prev + 1);
    } else {
      console.error('Error updating upvotes:', error);
    }
  };

  return (
    <div className="Card">
      <Link to={'/edit/' + props.id}>
        <img className="moreButton" alt="edit button" src={more} />
      </Link>

      <h2 className="title">{props.title}</h2>

      {props.author && <h3 className="author">by {props.author}</h3>}

      <p className="content">{props.content}</p>

      {props.image_url && (
        <img
          className="post-image"
          src={props.image_url}
          alt="Post visual"
          style={{ maxWidth: '100%', marginTop: '10px' }}
        />
      )}

      <p className="type"><strong>Type:</strong> {props.post_type}</p>

      {props.repost_of && (
        <p className="repost">
          <em>Repost of Post #{props.repost_of}</em>
        </p>
      )}

      <button className="betButton" onClick={updateCount}>
        👍 Upvotes: {count}
      </button>
    </div>
  );
};

export default Card;

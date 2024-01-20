import { useState } from 'react';
import './PostReviewModal.css';

function PostReviewModal() {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <>
      <form className='review-form'>
        <h2>How was your stay?</h2>
        <textarea></textarea>
        <span>
          {
            [...Array(5)].map((star, i) => {
              const currentRating = i + 1
              return (
                <label key={i}>
                  <input
                    type='radio'
                    name='rating'
                    onClick={() => setRating(currentRating)}
                  />
                  <i
                    className={currentRating <= (hover || rating) ?
                      'fa-solid fa-star' : 'fa-regular fa-star'}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              )
            })
          }Stars
        </span>
        <button>Submit Your Review</button>
      </form>
    </>
  )
}

export default PostReviewModal;

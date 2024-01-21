import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { createReview } from '../../store/reviewsReducer';
import { useModal } from '../../context/Modal';
import './PostReviewModal.css';

function PostReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      review,
      stars
    }

    return dispatch(createReview(spotId, payload))
      .then(reset())
      .then(closeModal)
      .catch(async res => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  }

  const reset = () => {
    setStars(0);
    setHover(0);
    setReview('');
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='review-form'>
        <h2>How was your stay?</h2>
        {errors.review && <p className='err'>{errors.review}</p>}
        {errors.stars && <p className='err'>{errors.stars}</p>}
        <textarea
          name='review'
          placeholder='Leave your review here...'
          value={review}
          onChange={e => setReview(e.target.value)}
        ></textarea>
        <div className='stars'>
          <span>
            {
              [...Array(5)].map((star, i) => {
                const currentStars = i + 1
                return (
                  <label key={i}>
                    <input
                      type='radio'
                      name='stars'
                      onClick={() => setStars(currentStars)}
                    />
                    <i
                      className={currentStars <= (hover || stars) ?
                        'fa-solid fa-star' : 'fa-regular fa-star'}
                      onMouseEnter={() => setHover(currentStars)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                )
              })
            }
          </span>
          Stars
        </div>
        <button
          disabled={!stars || review.length < 10}
        >Submit Your Review</button>
      </form>
    </>
  )
}

export default PostReviewModal;

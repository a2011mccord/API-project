import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';

const LOAD_REVIEWS_BY_SPOT = 'reviews/loadReviewsBySpot';
const ADD_REVIEW = 'reviews/addReview';

const loadReviewsBySpot = reviews => ({
  type: LOAD_REVIEWS_BY_SPOT,
  reviews
});

const addReview = review => ({
  type: ADD_REVIEW,
  review
})

export const fetchReviewsBySpot = spotId => async dispatch => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(loadReviewsBySpot(reviews));
  }
}

export const createReview = (spotId, payload) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(addReview(newReview));
    return newReview;
  }
}

const selectedReviews = state => state.reviewsState.reviews;
export const selectReviewsArray = createSelector(selectedReviews, reviews => Object.values(reviews));

const initialState = { reviews: {} }

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS_BY_SPOT: {
      const newState = { ...state, reviews: {} };

      action.reviews.Reviews.forEach(review => {
        newState.reviews[review.id] = review;
      });

      return newState;
    }
    case ADD_REVIEW: {
      const newState = { ...state, reviews: { ...state.reviews } };

      newState.reviews[action.review.id] = action.review;

      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;

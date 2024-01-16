import { createSelector } from 'reselect';

const LOAD_REVIEWS_BY_SPOT = 'reviews/loadReviewsBySpot';

const loadReviewsBySpot = reviews => ({
  type: LOAD_REVIEWS_BY_SPOT,
  reviews
});

export const fetchReviewsBySpot = spotId => async dispatch => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const reviews = await res.json();
    dispatch(loadReviewsBySpot(reviews));
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
    default:
      return state;
  }
};

export default reviewsReducer;

import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotDetails } from "../../store/spotsReducer";
import { fetchReviewsBySpot, selectReviewsArray } from "../../store/reviewsReducer";
import './SpotDetails.css';

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector(state => state.spotsState.spotDetails);
  const spotReviews = useSelector(selectReviewsArray);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviewsBySpot(spotId));
  }, [dispatch, spotId])

  return (
    <>
      <div>
        <h1>{spotDetails.name}</h1>
      </div>
      <div>
        {
          spotReviews && spotReviews.map(review => {
            return (
              <div key={review.id}>
                <h3>{review.User.firstName}</h3>
                <span>{review.createdAt}</span>
                <p>{review.review}</p>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default SpotDetails;

import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSpotDetails } from "../../store/spotsReducer";
import { fetchReviewsBySpot, selectReviewsArray } from "../../store/reviewsReducer";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import './SpotDetails.css';

function SpotDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spotDetails = useSelector(state => state.spotsState.spotDetails);
  const spotReviews = useSelector(selectReviewsArray);
  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviewsBySpot(spotId));
  }, [dispatch, spotId])

  return (
    <>
      {spotDetails &&
        <div className="details-wrapper">
          <header>
            <h1>{spotDetails.name}</h1>
            <h3>{`${spotDetails.city}, ${spotDetails.state}, ${spotDetails.country}`}</h3>
          </header>
          <div className="images-wrapper">
            <div id="preview-image">
              <img src={spotDetails.SpotImages?.find(image => image.preview).url} />
            </div>
            {spotDetails.SpotImages?.map(image => {
              if (!image.preview) {
                return (
                  <div key={image.id}>
                    <img src={image.url} />
                  </div>
                )
              }
            })}
          </div>
          <section>
            <h2>{`Hosted by ${spotDetails.Owner?.firstName} ${spotDetails.Owner?.lastName}`}</h2>
            <p>{spotDetails.description}</p>
          </section>
          <div className="reserve">
            <div className="price">{`$${spotDetails.price} night`}</div>
            <div className="ratings">
              <i className="fa-solid fa-star" />
              {spotDetails.avgStarRating !== "No reviews for this spot yet" ?
                spotDetails.avgStarRating : "New"}
              {' '}&#x2022;{' '}
              {`${spotDetails.numReviews} ${spotDetails.numReviews === 1 ? "review" : "reviews"}`}
            </div>
            <button
              onClick={() => alert("Feature coming soon...")}
            >Reserve</button>
          </div>

          <div className="bar" />

          <div className="reviews-wrapper">
            <div className="ratings">
              <i className="fa-solid fa-star" />
              {spotDetails.avgStarRating !== "No reviews for this spot yet" ?
                spotDetails.avgStarRating : "New"}
              {' '}&#x2022;{' '}
              {`${spotDetails.numReviews} ${spotDetails.numReviews === 1 ? "review" : "reviews"}`}
            </div>

            {
              sessionUser && sessionUser.id !== spotDetails.ownerId &&
              !spotReviews.find(review => sessionUser.id === review.userId) &&
              <OpenModalButton
                buttonText='Post Your Review'
                modalComponent={<PostReviewModal spotId={spotId} />}
                onModalClose={() => navigate(`/spots/${spotId}`)}
              />
            }

            {!spotReviews.length && <p>Be the first to post a review!</p>}

            {
              spotReviews && spotReviews.map(review => {
                return (
                  <div key={review.id}>
                    <h3>{review.User?.firstName}</h3>
                    <span>{review.createdAt}</span>
                    <p>{review.review}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      }
    </>
  )
}

export default SpotDetails;

import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpots, selectSpotsArray } from "../../store/spotsReducer";
import './ViewAllSpots.css';

function ViewAllSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(selectSpotsArray);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="spots-wrapper">
      {
        spots && spots.map(spot => {
          return (
            <div
              key={spot.id}
              className="spot-tile"
              title={spot.name}
              onClick={() => {navigate(`/spots/${spot.id}`)}}
            >
              <img id="preview-image" src={spot.previewImage} alt={spot.name} />
              <div id="city-state">{`${spot.city}, ${spot.state}`}</div>
              <div id="rating">
                <i className="fa-solid fa-star" />
                {spot.avgRating !== "No reviews for this spot yet" ?
                  spot.avgRating : "N/A"}
              </div>
              <div id="price">{`$${spot.price} night`}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ViewAllSpots;

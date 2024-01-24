import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentSpots, selectSpotsArray } from "../../store/spotsReducer";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(selectSpotsArray);

  useEffect(() => {
    dispatch(fetchCurrentSpots(sessionUser));
  }, [dispatch, sessionUser]);

  return (
    <>
      <header className="manage-spots-header">
        <h1>Manage Your Spots</h1>
        <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
      </header>
      <div className="manage-spots-wrapper">
        {
          spots && spots.map(spot => {
            return (
              <div key={spot.id} className="spot-tile-wrapper">
                <div
                  className="spot-tile"
                  title={spot.name}
                  onClick={() => { navigate(`/spots/${spot.id}`) }}
                >
                  <img id="preview-image" src={spot.previewImage} alt={spot.name} />
                  <div id="city-state">{`${spot.city}, ${spot.state}`}</div>
                  <div id="rating">
                    <i className="fa-solid fa-star" />
                    {spot.avgRating !== "No reviews for this spot yet" ?
                      spot.avgRating : "New"}
                  </div>
                  <div id="price">{`$${spot.price} night`}</div>
                </div>
                <div>
                  <button onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                  <OpenModalButton
                    buttonText='Delete'
                    modalComponent={<DeleteSpotModal spotId={spot.id} />}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default ManageSpots;

import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots, selectSpotsArray } from "../../store/spotsReducer";

function ViewAllSpots() {
  const dispatch = useDispatch();
  const spots = useSelector(selectSpotsArray);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <>
      {
        spots && spots.map(spot => {
          return (
            <div key={spot.id}>
              <img src={spot.previewImage} alt={spot.name} />
              <div>{`${spot.city}, ${spot.state}`}</div>
              <div>{spot.avgRating}</div>
              <div>{`$${spot.price} night`}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default ViewAllSpots;

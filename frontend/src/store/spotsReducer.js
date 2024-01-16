import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spots/loadSpots';
const LOAD_SPOT_DETAILS = 'spots/loadSpotDetails';

const loadSpots = spots => ({
  type: LOAD_SPOTS,
  spots
});

const loadSpotDetails = spotDetails => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
})

export const fetchSpots = () => async dispatch => {
  const res = await fetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots));
  }
};

export const fetchSpotDetails = spotId => async dispatch => {
  const res = await fetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spotDetails = await res.json();
    dispatch(loadSpotDetails(spotDetails));
  }
};

const selectedSpots = state => state.spotsState.spots;
export const selectSpotsArray = createSelector(selectedSpots, spots => Object.values(spots));

const initialState = { spots: {}, spotDetails: {} }

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state, spots: { ...state.spots } };

      action.spots.Spots.forEach(spot => {
        newState.spots[spot.id] = spot
      });

      return newState;
    }
    case LOAD_SPOT_DETAILS: {
      const newState = { ...state, spotDetails: { ...state.spotDetails } };

      newState.spotDetails = action.spotDetails;

      return newState;
    }
    default:
      return state;
  }
}

export default spotsReducer;

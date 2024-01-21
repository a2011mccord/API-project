import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';

const LOAD_SPOTS = 'spots/loadSpots';
const LOAD_SPOT_DETAILS = 'spots/loadSpotDetails';
const ADD_SPOT = 'spots/addSpot';
const ADD_SPOT_IMAGE = 'spots/addSpotImage';

const loadSpots = spots => ({
  type: LOAD_SPOTS,
  spots
});

const loadSpotDetails = spotDetails => ({
  type: LOAD_SPOT_DETAILS,
  spotDetails
});

const addSpot = spot => ({
  type: ADD_SPOT,
  spot
});

const addSpotImage = spotImage => ({
  type: ADD_SPOT_IMAGE,
  spotImage
});

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

export const createSpot = payload => async dispatch => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }
};

export const createSpotImage = (spotId, payload) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    const newSpotImage = await res.json();
    dispatch(addSpotImage(newSpotImage));
    return newSpotImage;
  }
};

const selectedSpots = state => state.spotsState.spots;
export const selectSpotsArray = createSelector(selectedSpots, spots => Object.values(spots));

const initialState = { spots: {}, spotDetails: {}, spotImages: {} }

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
    case ADD_SPOT: {
      const newState = { ...state, spots: { ...state.spots } };

      newState.spots[action.spot.id] = action.spot;

      return newState;
    }
    case ADD_SPOT_IMAGE: {
      const newState = { ...state, spotImages: { ...state.spotImages } };

      newState.spotImages[action.spotImage.id] = action.spotImage;

      return newState;
    }
    default:
      return state;
  }
}

export default spotsReducer;

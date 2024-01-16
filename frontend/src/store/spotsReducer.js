import { createSelector } from 'reselect';

const LOAD_SPOTS = 'spots/loadSpots'

const loadSpots = spots => ({
  type: LOAD_SPOTS,
  spots
});

export const fetchSpots = () => async dispatch => {
  const res = await fetch('/api/spots');

  if (res.ok) {
    const spots = await res.json();
    dispatch(loadSpots(spots));
  }
};

const selectedSpots = state => state.spotsState.spots;
export const selectSpotsArray = createSelector(selectedSpots, spots => Object.values(spots));

const initialState = { spots: {} }

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state, spots: { ...state.spots } };

      action.spots.Spots.forEach(spot => {
        newState.spots[spot.id] = spot
      });

      return newState;
    }
    default:
      return state;
  }
}

export default spotsReducer;

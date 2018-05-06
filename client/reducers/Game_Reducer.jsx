
import { UPDATE_GAME } from '../actions/Role_Actions.jsx';

// const initialState = { Game: 'director' };

export default function Game(state = {}, action) {
  switch (action.type) {
    case UPDATE_GAME:
      return {
        ...state,
        game: action.game,
      };

    default:
      return state;
  }
}

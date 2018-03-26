
import { UPDATE_ROLE } from '../actions/Role_Actions.jsx';

const initialState = { role: 'none' };

export default function roles(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ROLE:
      return {
        ...state,
        role: action.role,
      };

    default:
      return state;
  }
}

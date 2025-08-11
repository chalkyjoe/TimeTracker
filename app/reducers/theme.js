import { SET_THEME } from '../actions/theme';

const initialState = 'light';

export default function theme(state = initialState, action) {
  switch (action.type) {
    case SET_THEME:
      return action.theme;
    default:
      return state;
  }
}

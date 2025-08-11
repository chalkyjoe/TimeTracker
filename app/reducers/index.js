import { combineReducers } from 'redux';
import tickets from './tickets';
import theme from './theme';

export default combineReducers({
  tickets,
  theme
});
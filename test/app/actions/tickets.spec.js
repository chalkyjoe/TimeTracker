import { expect } from 'chai';
import * as types from '../../../app/constants/ActionTypes';
import * as actions from '../../../app/actions/tickets';

describe('ticketapp ticket actions', () => {
  it('incrementTime should create INCREMENT_TIME action', () => {
    expect(actions.incrementTime(1)).to.eql({
      type: types.INCREMENT_TIME,
      id: 1
    });
  });

  it('addTicket should create ADD_TICKET action', () => {
    expect(actions.addTicket('Use Redux')).to.eql({
      type: types.ADD_TICKET,
      name: 'Use Redux'
    });
  });

  it('deleteTicket should create DELETE_TICKET action', () => {
    expect(actions.deleteTicket(1)).to.eql({
      type: types.DELETE_TICKET,
      id: 1
    });
  });

  it('editTicket should create EDIT_TODO action', () => {
    expect(actions.editTicket(1, 120)).to.eql({
      type: types.EDIT_TICKET,
      id: 1,
      time: 120
    });
  });
});

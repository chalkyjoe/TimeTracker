import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import * as TimeHelper from '../../../app/utils/TimeHelper';

describe('TimeHelper', () => {
  it('should render -1 seconds as 0 seconds', () => {
  	const output = TimeHelper.FormatTime(-1);
  	expect(output).to.equal('0s');
  });

  it('should render 0 seconds as 0 seconds', () => {
  	const output = TimeHelper.FormatTime(0);
  	expect(output).to.equal('0s');
  });

  it('should render 61 seconds as 1 minute 1 second', () => {
    const output = TimeHelper.FormatTime(61);
    expect(output).to.equal('1m 1s');
  });

  it('should render 120 seconds as 2 minutes', () => {
    const output = TimeHelper.FormatTime(120);
    expect(output).to.equal('2m 0s');
  });

  it('should render 360 seconds as 6 minutes', () => {
    const output = TimeHelper.FormatTime(360);
    expect(output).to.equal('6m 0s');
  });

  it('should render 3600 seconds as 1 hour', () => {
    const output = TimeHelper.FormatTime(3600);
    expect(output).to.equal('1h 0s');
  });

  it('should render 3661 seconds as 1 hour 1 minute 1 second', () => {
    const output = TimeHelper.FormatTime(3600);
    expect(output).to.equal('1h 1m 1s');
  });


});


import React, { Component, PropTypes } from 'react';
import style from './ThemePicker.css';

export default class ThemePicker extends Component {
  static propTypes = {
    theme: PropTypes.string.isRequired,
    setTheme: PropTypes.func.isRequired
  };

  onChange = (e) => {
    this.props.setTheme(e.target.value);
  };

  render() {
    return (
      <div className={style.themePicker}>
        <label>
          Theme:
          <select value={this.props.theme} onChange={this.onChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    );
  }
}

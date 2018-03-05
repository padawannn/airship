import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { colors } from '../../constants';

const Check = () => {
  return (
    <svg width="10" height="8" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.315 7.858L.133 4.441a.506.506 0 0 1 0-.683l.643-.684a.437.437 0 0 1 .642 0l2.219 2.393L8.58.141a.437.437 0 0 1 .643 0l.643.683a.504.504 0 0 1 0 .683l-5.91 6.35a.437.437 0 0 1-.642 0"
        fill="#FFF"
        fillRule="evenodd"
      />
    </svg>
  );
};

const StyledToggle = styled.div`
  display: inline-block;
  position: relative;

  &,
  &:after,
  &:before,
  & *,
  & *:after,
  & *:before {
    box-sizing: border-box;
  }

  > svg {
    opacity: 0;
    position: absolute;
    left: 4px;
    top: 4px;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  > input:checked ~ svg {
    opacity: 1;
  }

  > input {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  > input + label {
    width: 32px;
    height: 16px;
    outline: 0;
    display: block;
    position: relative;
    cursor: pointer;
    user-select: none;
    background: ${colors.ui04};
    border-radius: 40px;
    transition: all 0.4s ease;
  }

  > input + label::after {
    position: relative;
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    top: 2px;
  }

  > input + label::after {
    border-radius: 50%;
    background: #fff;
    transition: all 0.2s ease;
    transform: translateX(2px);
  }

  &:hover > input + label {
    background: ${colors.brand03};
  }

  &:hover > input:checked + label,
  > input:checked + label {
    background: ${colors.brand01};
  }

  > input:checked + label::after {
    transform: translateX(18px);
  }
`;
StyledToggle.displayName = 'StyledToggle';

class Toggle extends Component {
  state = {
    checked: !!this.props.checked
  };

  clickHandler = (e) => {
    const { onChange } = this.props;
    this.setState(
      (state) => {
        return {
          ...state,
          checked: !state.checked
        };
      },
      () => {
        onChange && onChange(this.state);
      }
    );
  };

  render() {
    const { htmlFor } = this.props;
    const { checked } = this.state;

    return (
      <React.Fragment>
        <StyledToggle>
          <input
            id={htmlFor}
            type="checkbox"
            checked={checked}
            onChange={this.clickHandler}
          />
          <label htmlFor={htmlFor} />
          <Check />
        </StyledToggle>
      </React.Fragment>
    );
  }
}

Toggle.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default Toggle;
import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { colors, fonts, shadows, responsive } from '../styles';

const shimmer = keyframes`
0% {
  background-position: -468px 0
}

100% {
  background-position: 468px 0
}

`;

const StyledInputWrapper = styled.div`
  width: 100%;
  opacity: ${({ fetching, disabled }) => (disabled && !fetching ? '0.5' : '1')};
`;

const StyledLabel = styled.label`
  color: rgb(${colors.grey});
  font-size: 13px;
  font-weight: ${fonts.weight.semibold};
  width: 100%;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
`;

const StyledInput = styled.input`
  width: 100%;
  margin-top: 8px;
  background: rgb(${colors.white});
  padding: 12px;
  border: none;
  border-style: none;
  font-family: ${({ monospace }) =>
    monospace ? `${fonts.family.SFMono}` : `inherit`};
  font-size: ${fonts.size.h6};
  font-weight: ${fonts.weight.semibold};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  border-radius: 8px;
  -webkit-box-shadow: ${shadows.medium};
  box-shadow: ${shadows.medium};
  outline: none;
  ${({ fetching }) =>
    fetching &&
    `
    color: rgba(${colors.dark}, 0.7);
    -webkit-animation-duration: 1s;
    -webkit-animation-fill-mode: forwards;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-name: ${shimmer};
    -webkit-animation-timing-function: linear;
    background: #f6f7f8;
    background-image: -webkit-gradient(linear, left center, right center, from(#f6f7f8), color-stop(.2, #edeef1), color-stop(.4, #f6f7f8), to(#f6f7f8));
    background-image: -webkit-linear-gradient(left, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-repeat: no-repeat;
    background-size: 800px 104px;
  `};
  &::placeholder {
    color: rgba(${colors.grey}, 0.8);
    font-weight: ${fonts.weight.medium};
    opacity: 1;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 8px 10px;
  }
`;

const Input = ({
  fetching,
  label,
  type,
  disabled,
  value,
  placeholder,
  monospace,
  ...props
}) => {
  let _label = label;
  let _placeholder = placeholder;
  if (!label) {
    if (type === 'email') {
      _label = 'Email';
      _placeholder = 'youremail@address.com';
    } else if (type === 'password') {
      _label = 'Password';
      _placeholder = '*********';
    } else if (type === 'text') {
      _label = '';
    }
  }
  if (!placeholder) {
    if (type === 'email') {
      _placeholder = 'youremail@address.com';
    } else if (type === 'password') {
      _placeholder = '*********';
    } else if (type === 'text') {
      _placeholder = '';
    }
  }
  return (
    <StyledInputWrapper disabled={fetching || disabled}>
      <StyledLabel hide={_label === 'Input'}>{_label}</StyledLabel>
      <StyledInput
        fetching={fetching}
        disabled={fetching || disabled}
        type={type}
        value={!disabled ? value : ''}
        placeholder={_placeholder}
        monospace={monospace}
        {...props}
      />
    </StyledInputWrapper>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  fetching: PropTypes.bool,
  monospace: PropTypes.bool,
  disabled: PropTypes.bool
};

Input.defaultProps = {
  label: '',
  placeholder: '',
  fetching: false,
  monospace: false,
  disabled: false
};

export default Input;

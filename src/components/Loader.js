import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { fonts, colors } from "../styles";

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled.div`
  position: relative;
  font-size: ${fonts.size.tiny};
  margin: 0 auto;
  text-indent: -9999em;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  background ${({ color }) => `rgb(${colors[color]})`};
  background: ${({ background, color }) =>
    `linear-gradient(to right, rgb(${colors[color]}) 10%, rgba(${
      colors[background]
    }, 0) 42%)`};
  animation: ${load} 1s infinite linear;
  transform: translateZ(0);

  &:before {
    width: 50%;
    height: 50%;
    background ${({ color }) => `rgb(${colors[color]})`};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  &:after {
    background: ${({ background }) => `rgb(${colors[background]})`};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const Loader = ({ size, color, background, ...props }) => (
  <StyledLoader size={size} color={color} background={background} {...props} />
);

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  background: PropTypes.string
};

Loader.defaultProps = {
  size: 50,
  color: "dark",
  background: "white"
};

export default Loader;

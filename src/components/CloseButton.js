import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors, transitions } from "../styles";

const StyledCloseButton = styled.div`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  position: absolute;
  transform: rotate(45deg);
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.5;
  }
`;

const StyledFirstLine = styled.div`
  position: absolute;
  width: 60%;
  border: 1px solid rgb(${colors.black});
  transition: ${transitions.base};
`;

const StyledSecondLine = styled.div`
  position: absolute;
  width: 60%;
  border: 1px solid rgb(${colors.black});
  transform: rotate(90deg);
`;

const CloseButton = ({ size, ...props }) => (
  <StyledCloseButton size={size} {...props}>
    <StyledFirstLine />
    <StyledSecondLine />
  </StyledCloseButton>
);

CloseButton.propTypes = {
  size: PropTypes.number
};

CloseButton.defaultProps = {
  size: 35
};

export default CloseButton;

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledIcon = styled.img`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`;

const Icon = ({ icon, size, ...props }) => (
  <StyledIcon size={size} src={icon} {...props} />
);

Icon.propTypes = {
  image: PropTypes.string,
  size: PropTypes.number
};

Icon.defaultProps = {
  asset: null,
  image: "",
  size: 20
};

export default Icon;

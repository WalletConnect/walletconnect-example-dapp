import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: ${({ size }) => (size ? `${size}px` : '32px')};
  height: ${({ size }) => (size ? `${size}px` : '32px')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  margin-right: 10px;
  overflow: hidden;
  & img {
    width: 100%;
  }
`;

const Blockie = ({ seed, color, bgcolor, size, scale, spotcolor }) => {
  const imgUrl = window.blockies
    .create({ seed, color, bgcolor, size, scale, spotcolor })
    .toDataURL();
  return (
    <StyledWrapper size={size}>
      <img src={imgUrl} alt="address" />
    </StyledWrapper>
  );
};

Blockie.propTypes = {
  seed: PropTypes.string.isRequired,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  size: PropTypes.number,
  scale: PropTypes.number,
  spotcolor: PropTypes.string
};

Blockie.defaultProps = {
  color: null,
  bgcolor: null,
  size: null,
  scale: null,
  spotcolor: null
};

export default Blockie;

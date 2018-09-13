import React from 'react';
import styled from 'styled-components';
import { colors, transitions } from '../styles';

const StyledCloseButton = styled.div`
  width: 35px;
  height: 35px;
  position: absolute;
  transform: rotate(45deg);
  top: 0;
  right: 0;
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
  transition: ${transitions.base}
`;

const StyledSecondLine = styled.div`
  position: absolute;
  width: 60%;
  border: 1px solid rgb(${colors.black});
  transform: rotate(90deg);
`;

const CloseButton = () => (
  <StyledCloseButton>
    <StyledFirstLine />
    <StyledSecondLine />
  </StyledCloseButton>
);

export default CloseButton;

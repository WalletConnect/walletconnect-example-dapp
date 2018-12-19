import React, { Fragment } from "react";
import styled, { keyframes } from "styled-components";
import Spacing from "./Spacing";

const load = keyframes`
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(0.8);
  }
  20% {
    transform: scale(1.0);
  }
  100% {
    transform: scale(1.0);
  }
`;

const StyledLoader = styled.svg`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  animation: ${load} 2s infinite linear;
  transform: translateZ(0);
`;

const Loader = ({ size, color }) => (
  <StyledLoader viewBox="0 0 186 187" size={size} color={color} >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <path d="M60,10.34375 C32.3857625,10.34375 10,32.7295125 10,60.34375 L10,126.34375 C10,153.957987 32.3857625,176.34375 60,176.34375 L126,176.34375 C153.614237,176.34375 176,153.957987 176,126.34375 L176,60.34375 C176,32.7295125 153.614237,10.34375 126,10.34375 L60,10.34375 Z M60,0.34375 L126,0.34375 C159.137085,0.34375 186,27.206665 186,60.34375 L186,126.34375 C186,159.480835 159.137085,186.34375 126,186.34375 L60,186.34375 C26.862915,186.34375 0,159.480835 0,126.34375 L0,60.34375 C0,27.206665 26.862915,0.34375 60,0.34375 Z" id="Rectangle-Copy" fill={color} fillRule="nonzero"></path>
    <rect id="Rectangle" fill={color} x="44" y="44.34375" width="98" height="98" rx="35"></rect>
    </g>
  </StyledLoader>
);

const PendingLoader = () => (
    <Fragment>
      <Loader color={'#4099ff'} size={40} />
      <Spacing top={30}>
          <p>Approve or reject request using your wallet</p>
      </Spacing>
    </Fragment>
);

export default PendingLoader;



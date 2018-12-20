import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, transitions } from "../styles";

const SModal = styled.div`
  height: 100vh;
  width: 100vw;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  will-change: opacity;
  background-color: rgba(${colors.black}, 0.7);
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SCloseButton = styled.div`
  transition: ${transitions.short};
  position: absolute;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  right: ${({ size }) => `${size / 1.6667}px`};
  top: ${({ size }) => `${size / 1.6667}px`};
  opacity: 0.5;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  &:before,
  &:after {
    position: absolute;
    content: " ";
    height: ${({ size }) => `${size}px`};
    width: 2px;
    background: ${({ color }) => `rgb(${colors[color]})`};
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

const SCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 25px;
  background-color: rgb(${colors.white});
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Modal = ({ children, show, toggleModal, ...otherProps }) => (
  <SModal show={show} {...otherProps}>
    <SCard>
      <SCloseButton size={25} color={"dark"} onClick={toggleModal} />
      <div>{children}</div>
    </SCard>
  </SModal>
);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default Modal;

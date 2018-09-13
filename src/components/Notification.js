import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors, shadows, responsive, transitions } from "../styles";

const StyledNotification = styled.div`
  position: fixed;
  z-index: 20;
  width: calc(100% - 20px);
  max-width: 400px;
  top: 0;
  right: 0;
  margin: 10px;
  text-align: center;
  padding: 15px 20px;
  border-radius: 8px;
  text-align: center;
  transition: ${transitions.base};
  background: rgb(${colors.white});
  color: ${({ error }) =>
    error ? `rgb(${colors.red})` : `rgb(${colors.dark})`};
  box-shadow: ${shadows.medium};
  transform: ${({ show }) =>
    show ? "translate3d(0, 0, 0)" : "translate3d(0, -1000px, 0);"};
  @media screen and (${responsive.sm.max}) {
    top: auto;
    bottom: 0;
    transform: ${({ show }) =>
      show ? "translate3d(0, 0, 0)" : "translate3d(0, 1000px, 0);"};
  }
`;

const Notification = ({ show, error, message, ...props }) => (
  <StyledNotification show={show} error={error} {...props}>
    {message}
  </StyledNotification>
);

Notification.propTypes = {
  show: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
};

export default Notification;

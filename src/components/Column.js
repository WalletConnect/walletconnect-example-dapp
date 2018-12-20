import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const SColumn = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? "100%" : "auto")};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? "center" : "flex-start")};
`;

const Column = ({ children, spanHeight, maxWidth, center, ...props }) => (
  <SColumn
    spanHeight={spanHeight}
    maxWidth={maxWidth}
    center={center}
    {...props}
  >
    {children}
  </SColumn>
);

Column.propTypes = {
  children: PropTypes.node.isRequired,
  spanHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
  center: PropTypes.bool
};

Column.defaultProps = {
  spanHeight: false,
  maxWidth: 600,
  center: false
};

export default Column;

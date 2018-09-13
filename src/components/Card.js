import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Loader from "../components/Loader";
import { colors, fonts, shadows, transitions } from "../styles";

const StyledCard = styled.div`
  transition: ${transitions.base};
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "none")};
  border: none;
  border-style: none;
  color: rgb(${colors.dark});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  box-shadow: ${shadows.soft};
  border-radius: 10px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 0 auto;
  text-align: left;
  overflow: ${({ allowOverflow }) => (allowOverflow ? "visible" : "hidden")};
`;

const StyledContent = styled.div`
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "0")};
  padding: ${({ padding }) => (padding ? padding : null)};
  transition: ${transitions.base};
  opacity: ${({ fetching }) => (fetching ? 0 : 1)};
  visibility: ${({ fetching }) => (fetching ? "hidden" : "visible")};
  pointer-events: ${({ fetching }) => (fetching ? "none" : "auto")};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledFetching = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: ${transitions.short};
  opacity: ${({ fetching }) => (fetching ? 1 : 0)};
  visibility: ${({ fetching }) => (fetching ? "visible" : "hidden")};
  pointer-events: ${({ fetching }) => (fetching ? "auto" : "none")};
`;

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(${colors.grey});
  font-weight: ${fonts.weight.medium};
  margin: 20px;
`;

const Card = ({
  fetching,
  fetchingMessage,
  allowOverflow,
  background,
  maxWidth,
  minHeight,
  padding,
  children,
  ...props
}) => (
  <StyledCard
    allowOverflow={allowOverflow}
    background={background}
    maxWidth={maxWidth}
    {...props}
  >
    <StyledFetching fetching={fetching}>
      <StyledMessage>{fetchingMessage}</StyledMessage>
      <Loader color="darkGrey" background={background} />
    </StyledFetching>
    <StyledContent minHeight={minHeight} padding={padding} fetching={fetching}>
      {children}
    </StyledContent>
  </StyledCard>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  allowOverflow: PropTypes.bool,
  fetchingMessage: PropTypes.string,
  background: PropTypes.string,
  maxWidth: PropTypes.number
};

Card.defaultProps = {
  fetching: false,
  allowOverflow: false,
  fetchingMessage: "",
  background: "white",
  maxWidth: null,
  minHeight: null
};

export default Card;

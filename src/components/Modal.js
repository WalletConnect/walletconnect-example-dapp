import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Column from "../components/Column";
import Card from "../components/Card";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { colors, transitions } from "../styles";

const StyledLightbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transition: ${transitions.base};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  background: rgba(${colors.dark}, 0.3);
`;

const StyledHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  margin: 0 16px;
  max-height: 500px;
`;

const StyledQRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledQRCodeDisplay = styled(QRCodeDisplay)`
  margin: 0 auto;
`;

const StyledCenter = styled.div`
  text-align: center;
`;

class Modal extends Component {
  state = {
    fetching: false
  };

  render = () => {
    const { uri, showModal, closeModal } = this.props;

    const body = document.body || document.getElementsByTagName("body")[0];

    if (showModal) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return (
      <StyledLightbox show={showModal}>
        <StyledContainer>
          <StyledHitbox onClick={closeModal} />
          <Column center>
            <StyledCard
              maxWidth={window.innerWidth < 530 ? 300 : 400}
              background="white"
            >
              <StyledQRCodeWrapper>
                {uri && (
                  <StyledQRCodeDisplay
                    data={uri}
                    scale={this.isSmallScreen ? 5 : 7}
                  />
                )}
              </StyledQRCodeWrapper>
            </StyledCard>
          </Column>
        </StyledContainer>
      </StyledLightbox>
    );
  };
}

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  uri: PropTypes.string.isRequired
};

export default Modal;

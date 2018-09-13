import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import QRCode from "qrcode";

const StyledWrapper = styled.div`
  width: 100%;
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class QRCodeDisplay extends Component {
  componentDidMount() {
    QRCode.toCanvas(
      this.canvas,
      this.props.data,
      {
        errorCorrectionLevel: this.props.errorCorrectionLevel,
        scale: this.props.scale
      },
      error => {
        if (error) console.error(error);
      }
    );
  }
  render = () => (
    <StyledWrapper {...this.props}>
      <canvas ref={c => (this.canvas = c)} />
    </StyledWrapper>
  );
}

QRCodeDisplay.propTypes = {
  data: PropTypes.string.isRequired,
  errorCorrectionLevel: PropTypes.string,
  scale: PropTypes.number
};

QRCodeDisplay.defaultProps = {
  errorCorrectionLevel: "L",
  scale: 7
};

export default QRCodeDisplay;

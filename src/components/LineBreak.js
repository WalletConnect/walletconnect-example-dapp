import React from 'react';
import styled from 'styled-components';

const StyledLineBreakWrapper = styled.div`
  position: relative;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  margin-top: 0 !important;
  border-top: 2px solid rgba(241, 242, 246, 0.2);
`;
const LineBreak = ({ ...props }) => <StyledLineBreakWrapper {...props} />;
export default LineBreak;

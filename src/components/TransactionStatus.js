import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';
import successState from '../assets/success-state.svg';
import defaultState from '../assets/default-state.svg';

const StyledTransactionStatus = styled.div`
  display: flex;
`;

const StyledAsset = styled.div`
  width: 34px;
  height: 34px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

const StyledSuccess = styled(StyledAsset)`
  background-image: url(${successState});
`;

const StyledDefault = styled(StyledAsset)`
  background-image: url(${defaultState});
`;

const TransactionStatus = ({ status, ...props }) => (
  <StyledTransactionStatus {...props}>
    {(() => {
      switch (status) {
        case 'pending':
          return <Loader size={34} />;
        case 'success':
          return <StyledSuccess />;
        default:
          return <StyledDefault />;
      }
    })()}
  </StyledTransactionStatus>
);

export default TransactionStatus;

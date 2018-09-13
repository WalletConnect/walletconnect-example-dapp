import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledForm = styled.form`
  width: 100%;
  padding: 10px;
`;

class Form extends Component {
  componentWillUnmount() {
    document.activeElement.blur();
  }

  onSubmitForm = (event) => {
    event.preventDefault();
    this.props.onSubmit(event);
  };

  render = () => {
    const { children, ...otherProps } = this.props;
    return (
      <StyledForm {...otherProps} onSubmit={this.onSubmitForm}>
        {children}
      </StyledForm>
    );
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func
};

Form.defaultProps = {
  onSubmit: () => {}
};

export default Form;

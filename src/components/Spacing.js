import styled from 'styled-components';
import PropTypes from "prop-types";

const propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
}

const Spacing = styled.div`
    margin-top: ${({top})=> `${top}px` };
    margin-left: ${({left})=> `${left}px` };
    margin-right: ${({right})=> `${right}px` };
    margin-bottom: ${({bottom})=> `${bottom}px` };
    `;

Spacing.propTypes = propTypes;

export default Spacing;
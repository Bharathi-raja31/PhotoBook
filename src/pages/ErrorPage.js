import * as React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from "react-helmet";

import { Container } from 'react-bootstrap';

const messages = {
  404: 'Page that lookin\' not found...',
  500: 'There was error in Request. Please try again or contact Help & Support',
  unknown: 'Unknown Issue.Contact Help & Support',
};

const ErrorPage = ({ code }) => (
  <div className="error-page">
    <Helmet title={`${code} Photo Book - Photography Management`} />
    <Container>
      <div className="error-content">
        <h1>{code}</h1>
        <h4>{messages[code]}</h4>
        <a className="btn btn-primary" href="/">Back to Home</a>
      </div>
    </Container>
  </div>
);

ErrorPage.propTypes = {
  code: PropTypes.oneOf(['404', '500', 'Unknown']),
};

ErrorPage.defaultProps = {
  code: '404',
};
export default ErrorPage;

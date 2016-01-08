import React, { PropTypes } from 'react';

export default class ErrorPage extends React.Component {

  render() {
    const { err } = this.props;
    return (
      <div>
        <h1>Ocorreu um erro ao exibir esta página</h1>

        { process.env.NODE_ENV === 'development' && err &&
          <pre align="center">
            { err.message }
          </pre>
        }

      </div>
    );
  }

}

ErrorPage.propTypes = {
  err: PropTypes.object
};

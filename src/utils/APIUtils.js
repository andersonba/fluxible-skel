import request from 'superagent';
import { assign } from 'lodash';

import config from '../config';

const debug = require('debug')('yourApp');

const APIUtils = {

  get(endpoint, query, done) {
    if (arguments.length === 2) {
      done = query;
      query = {};
    }

    const url = `${config.apiUrl}${endpoint}`;

    debug('Sending GET request to %s', url, query);

    query = assign(query, {
      apiKey: config.apiKey
    });

    request.get(url)
      .query(query)
      .end((err, res) => {
        debug('Received response %s from %s', res && res.status, url);

        if (err) {
          if (err.status) {
            // Normalize statusCode vs. status
            err.statusCode = err.status;
          }

          return done(err);
        }

        done(null, res.body);
      });
  }

};

export default APIUtils;

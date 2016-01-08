// Express middleware to render the app server-side and expose its state
// to the client

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import serialize from 'serialize-javascript';
import { navigateAction } from 'fluxible-router';

import app from '../app';
import Html from '../containers/Html';


function renderApp(req, res, context, next) {
  try {

    // dehydrate the app and expose its state
    const state = 'window.__INITIAL_STATE__=' + serialize(app.dehydrate(context)) + ';';

    const Root = app.getComponent();
    const appContext = context.getComponentContext();
    const htmlStore = appContext.getStore('HtmlHeadStore');

    // Render the Root to string
    const content = ReactDOMServer.renderToString(
      <Root context={ appContext } />
    );

    // The root component is rendered as static markup and sent as response.
    const html = ReactDOMServer.renderToStaticMarkup(
      <Html
        context={ context.getComponentContext() }
        state={ state }
        content={ content }
      />
    );
    const doctype = '<!DOCTYPE html>';
    res.status(htmlStore.getStatusCode()).send(doctype + html);
  }
  catch (e) {
    next(e);
  }
}

export default function handleServerRendering(req, res, next) {

  // Create a fluxible context (_csrf is needed by the fetchr plugin)
  const context = app.createContext({
    req: req,
    xhrContext: {
      '_csrf': req.csrfToken()
    }
  });

  Promise.all([ context.executeAction(navigateAction, {
    url: req.url,
    method: req.method
  }) ])
    .then(() => renderApp(req, res, context, next))
    .catch(err => {
      if (err.statusCode || err.status) {
        renderApp(req, res, context, next);
        return;
      }
      next(err);
    });

}

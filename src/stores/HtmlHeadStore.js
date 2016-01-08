import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';

const SITE_NAME = 'Fluxible Skeleton';
const BASE_URL = 'https://github.com/andersonba/fluxible-skel';

/*
This store listens to fluxible-router's actions and keep
the content for the <head> tag. Used in Html.js,
and Root.js (to change the document's title)
 */

export default class HtmlHeadStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.siteName = SITE_NAME;
    this.currentUrl = null;
    this.statusCode = null;
    this.setInitialState();
  }

  setInitialState() {
    this.title = 'Hello word!';
    this.description = 'The fluxible-skeleton description';
    this.images = [];
    this.statusCode = 200;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getSiteName() {
    return this.siteName;
  }

  getCurrentUrl() {
    const route = this.dispatcher.getStore('RouteStore').getCurrentRoute();
    if (!route) {
      return BASE_URL;
    }
    return `${BASE_URL}${route.url}`;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getImages() {
    return this.images;
  }

  handleNavigateStart() {
    // Use a loading title when loading the route
    this.title = 'Loading...';
    this.emitChange();
  }

  // Set the store content (images, description, title, etc.) according to the received route
  // Remember: route is an immutable object!

  handleNavigateSuccess(route) {

    switch (route.name) {

    default:
      this.setInitialState();
      break;

    }

    this.emitChange();
  }

  handleNavigateFailure(error) {
    this.statusCode = error.statusCode;

    if (error.statusCode === 404) {
      this.title = 'Page not found';
    }
    else {
      this.title = 'Error found';
    }
    this.emitChange();
  }

}

HtmlHeadStore.storeName = 'HtmlHeadStore';
HtmlHeadStore.handlers = {
  [Actions.NAVIGATE_START]: 'handleNavigateStart',
  [Actions.NAVIGATE_SUCCESS]: 'handleNavigateSuccess',
  [Actions.NAVIGATE_FAILURE]: 'handleNavigateFailure'
};

import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import { RouteStore } from 'fluxible-router';

import routes from './routes';

import Root from './containers/Root';

import HtmlHeadStore from './stores/HtmlHeadStore';

// Create the fluxible app using Root as root component
const app = new Fluxible({ component: Root });

// Make fetchr services respond to /api endpoint
app.plug(fetchrPlugin({ xhrPath: '/api' }));

// Register a fluxible RouteStore
const AppRouteStore = RouteStore.withStaticRoutes(routes);
app.registerStore(AppRouteStore);

// Register app-specific stores
app.registerStore(HtmlHeadStore);

export default app;

import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'containers/App';
import Home from 'components/Home';
import PlayerLogin from 'components/PlayerLogin';

const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="player-login" component={PlayerLogin} />
    </Route>
  </Route>
);

export default routes;

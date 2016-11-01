import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'containers/App';
import Dashboard from 'containers/Dashboard';
import Home from 'components/Home';
import DMLogin from 'components/DMLogin';
import PlayerLogin from 'components/PlayerLogin';
import CreateAccount from 'components/CreateAccount';
import CreateCharacter from 'components/CreateCharacter';
import ViewCharacter from 'components/ViewCharacter';
import CreateCombat from 'components/CreateCombat';
import ViewCombat from 'components/ViewCombat';

const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="dm-login" component={DMLogin} />
      <Route path="player-login" component={PlayerLogin} />
      <Route path="create-account" component={CreateAccount} />
      <Route path="dashboard" component={Dashboard} />
      <Route path="create-character" component={CreateCharacter} />
      <Route path="edit-character/:characterIndex" component={ViewCharacter} />
      <Route path="create-combat" component={CreateCombat} />
      <Route path="edit-combat/:combatIndex" component={ViewCombat} />
    </Route>
  </Route>
);

export default routes;

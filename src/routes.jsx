import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'containers/App';
import Dashboard from 'containers/Dashboard';
import DMCombat from 'containers/DMCombat';
import PlayerCombat from 'containers/PlayerCombat';
import ViewCombat from 'containers/ViewCombat';

import Home from 'components/Home';
import DMLogin from 'components/DMLogin';
import PlayerLogin from 'components/PlayerLogin';
import CreateAccount from 'components/CreateAccount';
import CreateCharacter from 'components/CreateCharacter';
import EditCharacter from 'components/EditCharacter';
import CreateCombat from 'components/CreateCombat';
import EditCombat from 'components/EditCombat';
import ChooseCharacter from 'components/ChooseCharacter';

const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="dm-login" component={DMLogin} />
      <Route path="player-login" component={PlayerLogin} />
      <Route path="create-account" component={CreateAccount} />
      <Route path="dashboard" component={Dashboard} />
      <Route path="create-character" component={CreateCharacter} />
      <Route path="edit-character/:characterIndex" component={EditCharacter} />
      <Route path="create-combat" component={CreateCombat} />
      <Route path="edit-combat/:combatIndex" component={EditCombat} />
      <Route path="combat/:combatIndex" component={DMCombat} />
      <Route path="choose-character/:combatIndex" component={ChooseCharacter} />
      <Route path="player-combat/:combatIndex" component={PlayerCombat} />
      <Route path="view-combat/:combatIndex" component={ViewCombat} />
    </Route>
  </Route>
);

export default routes;

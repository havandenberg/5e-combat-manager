import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'containers/App';
import PlayerDashboard from 'containers/PlayerDashboard';
import Home from 'components/Home';
import DMLogin from 'components/DMLogin';
import PlayerLogin from 'components/PlayerLogin';
import CreateAccount from 'components/CreateAccount';
import ViewCharacter from 'components/ViewCharacter';

class CreateCharacter extends React.Component {
  render() {
    return (
        <ViewCharacter isNew={true} />
    );
  }
}

const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="dm-login" component={DMLogin} />
      <Route path="player-login" component={PlayerLogin} />
      <Route path="create-account" component={CreateAccount} />
      <Route path="dashboard" component={PlayerDashboard} />
      <Route path="create-character" component={CreateCharacter} />
    </Route>
  </Route>
);

export default routes;

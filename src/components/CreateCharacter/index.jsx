import React from 'react';
import ViewCharacter from 'components/ViewCharacter';

export default class CreateCharacter extends React.Component {
  render() {
    return (
        <ViewCharacter isNew={true} />
    );
  }
}

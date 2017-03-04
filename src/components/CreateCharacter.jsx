import React from 'react';
import EditCharacter from 'components/EditCharacter';

export default class CreateCharacter extends React.Component {
  render() {
    return (
        <EditCharacter isNew={true} />
    );
  }
}

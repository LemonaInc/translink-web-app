import React, {PureComponent} from 'react';

const defaultContainer =  ({children}) => <div className="options">{children}</div>;

export default class Options extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;

    return (
      <Container>
       <center>  <h3>Welcome to Translink Connector</h3> </center>
      </Container> );
    }
}

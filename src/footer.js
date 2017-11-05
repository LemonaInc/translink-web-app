import React, {PureComponent} from 'react';

const defaultContainer =  ({children}) => <div className="footer">{children}</div>;

export default class Footer extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;

    return (
      <Container>
       <center>  <h3>This is the footer</h3> </center>
      </Container> );
    }
}

import React from 'react';  

class PureIframe extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <iframe {...this.props} title={this.props.title} />;
  }
}

export default PureIframe;

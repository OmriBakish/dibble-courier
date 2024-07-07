import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';

class ProgressiveImage extends React.Component {

    constructor(props) {
        super(props)
        this.state = { loading: true }
    }

    render() {
        let allState = this.state;
        return ({ allState.loading ? <ActivityIndicator loading={true}></ActivityIndicator> : <Image {...this.props} /> }
        )
    }
}
export default ProgressiveImage;
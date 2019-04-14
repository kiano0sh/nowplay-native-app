import React from 'react'
import {View} from 'react-native'
import {Text, Button} from 'react-native-elements'


class GlobalFooter extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
        }
    }

    render() {
        return(
            <View style={{backgroundColor: 'blue'}}>
                <Text style={{color: 'white'}}>Music player here ;)</Text>
            </View>
        )
    }
}

export default GlobalFooter
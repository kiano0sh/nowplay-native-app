import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text, Card, Icon} from 'react-native-elements'


class GlobalFooter extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <View style={styles.container}>
                <Icon type={'foundation'} name={'previous'} size={styles.iconSize}  color={'white'} />
                <Icon type={'foundation'} name={'play-circle'} size={styles.iconSize} containerStyle={styles.playButtonStyle} color={'white'}/>
                <Icon type={'foundation'} name={'next'} size={styles.iconSize} containerStyle={styles.nextButtonStyle} color={'white'}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#393e42'
    },
    playButtonStyle: {
        marginRight: 20,
        marginLeft: 20
    },
    nextButtonStyle: {
        marginRight: 10
    },
    iconSize: 40
});

export default GlobalFooter

// {/*<View style={{backgroundColor: 'blue'}}>*/}
// {/*    <Text style={{color: 'white'}}>Music player here ;)</Text>*/}
// {/*</View>*/}
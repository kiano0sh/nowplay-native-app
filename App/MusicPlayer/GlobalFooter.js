import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text, Card, Icon} from 'react-native-elements'


class GlobalFooter extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Icon type={'foundation'} name={'previous'} size={30}  color={'white'} />
                    <Icon type={'foundation'} name={'play-circle'} size={40} containerStyle={styles.playButtonStyle} color={'white'}/>
                    <Icon type={'foundation'} name={'next'} size={30} containerStyle={styles.nextButtonStyle} color={'white'}/>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyles}>
                        some music title here
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#393e42'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: -32,
        marginLeft: 10,
    },
    titleStyles: {
        color: '#fff',
        fontSize: 18
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
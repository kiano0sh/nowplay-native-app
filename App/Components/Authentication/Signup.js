import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View} from 'react-native'
import {Input, Button} from 'react-native-elements';



class Login extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Input
                    placeholder='Username'
                    leftIcon={
                        <Icon
                            name='user'
                            size={24}
                            color='black'
                        />
                    }
                    shake={true}
                    errorStyle={{ color: 'red' }}
                    errorMessage={false &&'ENTER A VALID ERROR HERE'}
                />
                <Input
                    placeholder='Phone Number or Email'
                    leftIcon={
                        <Icon
                            name='lock'
                            size={24}
                            color='black'
                        />
                    }
                    shake={true}
                    errorStyle={{ color: 'red' }}
                    errorMessage={false &&'ENTER A VALID ERROR HERE'}
                />
                <Input
                    placeholder='Password'
                    leftIcon={
                        <Icon
                            name='lock'
                            size={24}
                            color='black'
                        />
                    }
                    shake={true}
                    errorStyle={{ color: 'red' }}
                    errorMessage={false &&'ENTER A VALID ERROR HERE'}
                />
                <Button
                    type="solid"
                    icon={
                        <Icon
                            name="arrow-right"
                            size={15}
                            color="white"
                        />
                    }
                    title="Signup"
                    loading={false}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    InputMargin: {
        marginBottom: '10px'
    }
});

export default Login
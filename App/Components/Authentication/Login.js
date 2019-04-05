import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View} from 'react-native'
// TODO should use something else
const Joi = require('joi-react-native');
import {login} from "../../Queries/Mutation";
import {GET_TOKEN} from "../../Queries/CacheQueries";
import {Mutation} from "react-apollo";
import {updateHeaders} from '../../ApolloClient'
import {Input} from "react-native-elements";
import {Button} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomInput from '../CustomInput'

class Login extends Component {
    constructor(props, context) {
        super(props);
        // this.state = {
        //     username: '',
        //     usernameErrorMessage: '',
        //     password: '',
        //     passwordErrorMessage: '',
        //     resultRegister: '',
        //     resultLogin: ''
        // };

        // this.handleUsernameChange = this.handleUsernameChange.bind(this)
        // this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    // handleUsernameChange(username) {
    //     console.log(username);
    //     const {error, value} = Joi.validate(username, Joi.string().alphanum().min(3).max(30).required().label('username'));
    //
    //     if (error) {
    //         this.setState({usernameErrorMessage: `${error.details[0].message}`})
    //     } else {
    //         this.setState({usernameErrorMessage: '', username: value})
    //     }
    // }
    //
    // handlePasswordChange(password) {
    //     const {error, value} = Joi.validate(password, Joi.string()
    //         .regex(/^[a-zA-Z0-9]{3,30}$/)
    //         .error(() => "This doesn't like a valid password!")
    //         .required()
    //         .label('password'));
    //     if (error) {
    //         this.setState({passwordErrorMessage: `${error.details[0].message}`})
    //     } else {
    //         this.setState({passwordErrorMessage: '', password: value})
    //     }
    // }

    _handleSubmit = (values, bag, loginMutation) => {
        const {username, password} = values
        loginMutation({
            variables: {
                username,
                password
            }
        })
            .then(d => console.log(d, 's'))
            .catch(
                error => {
                    console.log(error);
                    console.log(bag);
                    bag.setSubmitting(false);
                    let message = error.message.split(':');
                    bag.setErrors(JSON.parse(message[1]+':'+message[2]));
                }
            )
    };

    render() {
        // const {usernameErrorMessage, passwordErrorMessage, username, password} = this.state;
        return (
            <Mutation
                mutation={login}
                update={(cache, {data: {login: {token}}}) => {
                    console.log(token, ' in cache');
                    cache.writeQuery({
                        query: GET_TOKEN,
                        data: {token}
                    });
                    updateHeaders()
                }}
            >
                {/*{(loginMutation, {loading, error, data, client}) => (*/}
                {/*    <View style={styles.container}>*/}
                {/*        <Input*/}
                {/*            placeholder='Username'*/}
                {/*            leftIcon={*/}
                {/*                <Icon*/}
                {/*                    name='user'*/}
                {/*                    size={24}*/}
                {/*                    color='black'*/}
                {/*                />*/}
                {/*            }*/}
                {/*            shake={true}*/}
                {/*            errorStyle={{color: 'red'}}*/}
                {/*            errorMessage={usernameErrorMessage}*/}
                {/*            onChangeText={this.handleUsernameChange}*/}
                {/*        />*/}

                {/*        <Input*/}
                {/*            placeholder='Password'*/}
                {/*            leftIcon={*/}
                {/*                <Icon*/}
                {/*                    name='lock'*/}
                {/*                    size={24}*/}
                {/*                    color='black'*/}
                {/*                />*/}
                {/*            }*/}
                {/*            shake={true}*/}
                {/*            errorStyle={{color: 'red'}}*/}
                {/*            errorMessage={passwordErrorMessage}*/}
                {/*            onChangeText={this.handlePasswordChange}*/}
                {/*        />*/}
                {/*        <Button*/}
                {/*            type="solid"*/}
                {/*            icon={*/}
                {/*                <Icon*/}
                {/*                    name="arrow-right"*/}
                {/*                    size={15}*/}
                {/*                    color="white"*/}
                {/*                />*/}
                {/*            }*/}
                {/*            title="Login"*/}
                {/*            loading={false}*/}
                {/*            onPress={() => {*/}
                {/*                console.log(username, password)*/}
                {/*                loginMutation({*/}
                {/*                    variables: {*/}
                {/*                        username,*/}
                {/*                        password*/}
                {/*                    }*/}
                {/*                })*/}
                {/*            }}*/}
                {/*        />*/}
                {/*        {loading && <Text>Loading...</Text>}*/}
                {/*        {error && <Text>Error :( Please try again</Text>}*/}
                {/*    </View>*/}
                {(loginMutation, {loading, error, data, client}) => (
                    <View style={styles.container}>
                        <Formik
                            initialValues={{username: '', password: ''}}
                            onSubmit={(values, bag) => this._handleSubmit(values, bag, loginMutation)}
                            validationSchema={Yup.object().shape({
                                username: Yup.string()
                                    .matches(/^[a-zA-Z0-9_]+$/, 'Not valid username')
                                    .required('Username is required'),
                                password: Yup.string()
                                    .min(6)
                                    .required('Password is required')
                            })}
                            render={({
                                         values,
                                         handleSubmit,
                                         setFieldValue,
                                         errors,
                                         touched,
                                         setFieldTouched,
                                         isValid,
                                         isSubmitting,
                                     }) => (
                                <React.Fragment>
                                    <CustomInput
                                        placeholder='Username'
                                        leftIcon={
                                            <Icon
                                                name='user'
                                                size={24}
                                                color='black'
                                            />
                                        }
                                        autoCapitalize="none"
                                        value={values.username}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="username"
                                        error={touched.username && errors.username}
                                    />
                                    <CustomInput
                                        placeholder='Password'
                                        leftIcon={
                                            <Icon
                                                name='lock'
                                                size={24}
                                                color='black'
                                            />
                                        }
                                        autoCapitalize="none"
                                        secureTextEntry
                                        value={values.password}
                                        onChange={setFieldValue}
                                        onTouch={setFieldTouched}
                                        name="password"
                                        error={touched.password && errors.password}
                                    />
                                    <Button
                                        backgroundColor="blue"
                                        buttonStyle={styles.button}
                                        title="Submit"
                                        onPress={handleSubmit}
                                        disabled={!isValid || isSubmitting}
                                        loading={isSubmitting}
                                    />
                                </React.Fragment>
                            )}
                        />
                    </View>
                )}
            </Mutation>
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


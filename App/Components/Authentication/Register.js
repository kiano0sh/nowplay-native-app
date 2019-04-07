import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View} from 'react-native'
import {login} from "../../Queries/Mutation";
import {GET_TOKEN} from "../../Queries/CacheQueries";
import {Mutation} from "react-apollo";
import {updateHeaders} from '../../ApolloClient'
import {Button} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomInput from '../CustomInput'

const Register = (props) => {
    function _handleSubmit(values, bag, loginMutation) {
        const {username, password} = values;
        loginMutation({
            variables: {
                username,
                password
            }
        })
            .catch(
                error => {
                    bag.setSubmitting(false);
                    let message = error.message.split(':');
                    bag.setErrors(JSON.parse(message[1] + ':' + message[2]));
                }
            )
    }

    return (
        <Mutation
            mutation={login}
            update={(cache, {data: {login: {token}}}) => {
                cache.writeQuery({
                    query: GET_TOKEN,
                    data: {token}
                });
                updateHeaders();
                props.navigation.navigate('App');
            }}
        >
            {(loginMutation, {loading, error, data, client}) => (
                <View style={styles.container}>
                    <Formik
                        initialValues={{username: '', password: '', phoneNumber: ''}}
                        onSubmit={(values, bag) => _handleSubmit(values, bag, loginMutation)}
                        validationSchema={Yup.object().shape({
                            username: Yup.string()
                                .matches(/^[a-zA-Z0-9_]+$/, 'Not a valid username')
                                .required('Username is required'),
                            phoneNumber: Yup.string()
                                .matches(/^[a-zA-Z0-9_]+$/, 'Not a valid username')
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
                                    placeholder='Phone Number'
                                    leftIcon={
                                        <Icon
                                            name='user'
                                            size={24}
                                            color='black'
                                        />
                                    }
                                    autoCapitalize="none"
                                    value={values.phoneNumber}
                                    onChange={setFieldValue}
                                    onTouch={setFieldTouched}
                                    name="username"
                                    error={touched.phoneNumber && errors.phoneNumber}
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
                                    title="Login"
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 20,
        // width: '100%',
    },
});

export default Register


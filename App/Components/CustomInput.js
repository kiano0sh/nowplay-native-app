import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';

const CustomInput = (props) => {
    function _handleChange(value) {
        props.onChange(props.name, value);
    }

    function _handleTouch() {
        props.onTouch(props.name);
    }

    const {label, error, ...rest} = props;
    return (
        <View style={styles.root}>
            <Input
                onChangeText={_handleChange}
                onBlur={_handleTouch}
                placeholder={label}
                label={label}
                errorStyle={{color: 'red'}}
                errorMessage={error}
                {...rest}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        width: '90%',
        alignSelf: 'center',
    },
});

export default CustomInput;
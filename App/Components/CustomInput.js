import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import {Input} from 'react-native-elements';

class CustomInput extends PureComponent {
    _handleChange = value => {
        this.props.onChange(this.props.name, value);
    };

    _handleTouch = () => {
        this.props.onTouch(this.props.name);
    };

    render() {
        const { label, error, ...rest } = this.props;
        return (
            <View style={styles.root}>
                <Input
                    onChangeText={this._handleChange}
                    onBlur={this._handleTouch}
                    placeholder={label}
                    label={label}
                    errorStyle={{color: 'red'}}
                    errorMessage={error}
                    {...rest}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: '90%',
        alignSelf: 'center',
    },
});

export default CustomInput;
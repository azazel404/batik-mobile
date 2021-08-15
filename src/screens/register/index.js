import React from 'react';
import AuthAPI from '../../api/AuthAPI';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, Input, Alert} from '@ui-kitten/components';
import {useForm, Controller} from 'react-hook-form';
import {moderateScale} from '../../helpers/scaling';

const Register = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const onSubmit = values => {
    let body = {
      name: values.name,
      address: values.address,
      phone_number: values.phone_number,
      email: values.email,
      password: values.password,
    };
    AuthAPI.Register(body)
      .then(res => {
        navigation.navigate('Login');
        Alert.alert('Successfully register, we will redirect to login');
      })
      .catch(err => {
        console.log('err', err);
      });
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: '100%', paddingHorizontal: moderateScale(24)}}>
        <View style={{marginBottom: moderateScale(12)}}>
          <Text category="h1">Register Your Account</Text>
        </View>
        <View style={{marginBottom: moderateScale(12)}}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
            defaultValue=""
          />
          {errors.name && <Text>This is required.</Text>}
        </View>
        <View style={{marginBottom: moderateScale(12)}}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="address"
            defaultValue=""
          />
          {errors.address && <Text>This is required.</Text>}
        </View>
        <View style={{marginBottom: moderateScale(12)}}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="phone_number"
            defaultValue=""
          />
          {errors.phone_number && <Text>This is required.</Text>}
        </View>
        <View style={{marginBottom: moderateScale(12)}}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors.email && <Text>This is required.</Text>}
        </View>

        <View style={{marginBottom: moderateScale(12)}}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="password"
                secureTextEntry={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
            defaultValue=""
          />
          {errors.password && <Text>This is required.</Text>}
        </View>
        <View style={{marginBottom: moderateScale(12)}}>
          <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
        </View>
        <View
          style={{
            marginBottom: moderateScale(12),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text category="label">Or </Text>
          <TouchableOpacity onPress={() => navigation.push('Login')}>
            <Text category="label" status="primary">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Register;

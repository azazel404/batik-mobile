import React from 'react';
import AuthAPI from '../../api/AuthAPI';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, Input} from '@ui-kitten/components';
import {useForm, Controller} from 'react-hook-form';
import {moderateScale} from '../../helpers/scaling';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const onSubmit = values => {
    let body = {
      email: values.email,
      password: values.password,
    };
    AuthAPI.Login(body)
      .then(res => {
        AsyncStorage.setItem('token_login', res.data.data.token);
        navigation.push('Home');
      })
      .catch(err => {
        console.log('err data', {err});
      });
  };

  React.useEffect(async () => {
    let check = await AsyncStorage.getItem('token_login');
    console.log('check', check);
    if (check !== null) {
      navigation.push('Home');
    } else {
      return;
    }
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: '100%', paddingHorizontal: moderateScale(24)}}>
        <View style={{marginBottom: moderateScale(12)}}>
          <Text category="h1">Login</Text>
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
                placeholder="Password"
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
          <TouchableOpacity onPress={() => navigation.push('Register')}>
            <Text category="label" status="primary">
              Register
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

export default Login;

import {
  Alert,
  StyleSheet,
  View,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { app } from '../lib/firebase';
const AuthScreen = () => {
  const auth = getAuth(app);

  const [variant, setVariant] = useState('LOGIN');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    name: '',

    email: '',
    password: '',
    confirmPassword: '',
  });
  const { confirmPassword, name, password, email } = value;
  const onChangeValue = (value: string, key: string) => {
    setValue((val) => ({
      ...val,
      [key]: value,
    }));
  };
  const handleSignIn = () => {
    if (password.trim() === '' || email.trim() === '') {
      ToastAndroid.showWithGravityAndOffset(
        'Please fill all fields!!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        ToastAndroid.showWithGravityAndOffset(
          'Signed in successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/user-not-found') {
          return Alert.alert('User not found');
        }
        if (errorCode === 'auth/invalid-password') {
          return Alert.alert('Invalid credentials');
        }
        if (errorCode === 'auth/invalid-email') {
          return Alert.alert('Invalid Email');
        }
        return Alert.alert(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSignUp = () => {
    if (
      name.trim() === '' ||
      password.trim() === '' ||
      email.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      Alert.alert('Please all fields should be field!!');
      return;
    }
    if (value.password !== value.confirmPassword) {
      Alert.alert(
        'Password does not match',
        'Please enter matching passwords!'
      );
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        updateProfile(user, { displayName: name });
        return ToastAndroid.showWithGravityAndOffset(
          'You have successfully create an account',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/email-already-exists') {
          return Alert.alert('Email already in use');
        }

        if (errorCode === 'auth/invalid-email') {
          return Alert.alert('Invalid Email');
        }
        Alert.alert('An error occurred');
      })
      .finally(() => setLoading(false));

    setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };
  const handleVariants = () => {
    if (variant === 'LOGIN') {
      return setVariant('REGISTER');
    } else {
      return setVariant('LOGIN');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { marginTop: variant === 'LOGIN' ? 100 : 20 }]}
    >
      <Text variant="displayMedium">
        {variant === 'LOGIN' ? 'Welcome Back!!' : 'Join The Hub'}
      </Text>
      <View style={{ rowGap: 20, marginVertical: 20 }}>
        {variant !== 'LOGIN' && (
          <>
            <TextInput
              value={name}
              onChangeText={(val) => onChangeValue(val, 'name')}
              label={'Name'}
            />
          </>
        )}
        <TextInput
          value={email}
          onChangeText={(val) => onChangeValue(val, 'email')}
          keyboardType="email-address"
          label={'Email'}
        />
        <TextInput
          value={password}
          onChangeText={(val) => onChangeValue(val, 'password')}
          secureTextEntry
          label={'Password'}
        />
        {variant !== 'LOGIN' && (
          <TextInput
            value={confirmPassword}
            onChangeText={(val) => onChangeValue(val, 'confirmPassword')}
            secureTextEntry
            label={'Confirm Password'}
          />
        )}
      </View>
      <Button
        onPress={variant === 'LOGIN' ? handleSignIn : handleSignUp}
        mode="contained"
        loading={loading}
        disabled={loading}
      >
        {variant === 'LOGIN' ? 'Sign in' : 'Sign up'}
      </Button>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>
          {variant === 'LOGIN'
            ? 'Do not have an account?'
            : 'Already have an account?'}
        </Text>
        <Button onPress={handleVariants} style={{ marginLeft: -6 }}>
          {variant === 'LOGIN' ? 'Sign up' : 'Sign in'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
});

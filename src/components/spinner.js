import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Spinner} from '@ui-kitten/components';

const renderLoading = () => (
  <View style={styles.loading}>
    <Spinner />
  </View>
);

const styles = StyleSheet.create({
  loading: {
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default renderLoading;

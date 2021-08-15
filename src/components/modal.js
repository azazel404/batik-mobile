import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Modal, Text} from '@ui-kitten/components';
import {moderateScale} from '../helpers/scaling';

const ModalWithBackdropShowcase = props => {
  const {visible, setVisible, children} = props;

  return (
    <View style={styles.container}>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible()}>
        <Card
          disabled={true}
          style={{height: moderateScale(160), width: moderateScale(350)}}>
          {children}
        </Card>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ModalWithBackdropShowcase;

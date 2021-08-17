import React from 'react';
import {View, FlatList, Alert, Image, Text} from 'react-native';
import {moderateScale} from '../../helpers/scaling';
import {Input, Card, Button} from '@ui-kitten/components';
import Modal from '../../components/modal';
import UserAPI from '../../api/UserAPI';
import {useForm, Controller} from 'react-hook-form';
import {URLFILE} from '../../../config';

const DetailProduct = ({route, navigation}) => {
  const [profile, setProfile] = React.useState({});
  const [visible, setVisible] = React.useState(false);
  const [visibleModalCart, setVisibleModalCart] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [detailProduct, setDetailProduct] = React.useState({});

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  React.useEffect(() => {
    UserAPI.me()
      .then(res => {
        setProfile(res.data.data);
      })
      .catch(err => {
        console.log('err', {err});
      });
  }, []);

  const onSubmit = values => {
    console.log('detail', detailProduct);
    console.log('values', values);

    if (status === 'cart') {
      let body = {
        code: `INV-${Math.round(Math.random() * 1000000)}`,
        product_id: detailProduct.id,
        users_id: profile.id,
        qty: values.qty,
      };
      UserAPI.saveCart(body)
        .then(res => {
          Alert.alert('Message', 'Successfully add to cart');
          setVisibleModalCart(false);
          navigation.navigate('Cart');
        })
        .catch(err => {
          console.log('err data', {err});
        });
    } else {
      let body = {
        code: `INV-${Math.round(Math.random() * 1000000)}`,
        product_id: detailProduct.id,
        users_id: profile.id,
        trans_date: Date.now(),
        qty: values.qty,
        status: 0,
      };
      UserAPI.createOrder(body)
        .then(res => {
          Alert.alert('Message', 'Successfully to buy');
          setVisible(false);
          navigation.navigate('Account');
        })
        .catch(err => {
          console.log('err data', {err});
        });
    }
  };

  const {item} = route.params;

  console.log('item', item);
  return (
    <View style={{flex: 1, padding: moderateScale(12), alignItems: 'center'}}>
      {item && profile ? (
        <>
          <View style={{flexDirection: 'column'}}>
            <Image
              style={{
                width: moderateScale(320),
                height: moderateScale(320),
                resizeMode: 'cover',
              }}
              source={{
                uri: URLFILE + item.image,
              }}
            />

            <View>
              <Text style={{color: 'blue', fontSize: moderateScale(16)}}>
                {item.name}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: moderateScale(14),
                  marginTop: moderateScale(8),
                }}>
                Price: {item.price}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(14)}}>
                Category: {item && item.categories.name}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(14)}}>
                Stock: {item.stock}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(14)}}>
                {item.description}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: moderateScale(12),
                }}>
                <Button
                  style={{marginRight: moderateScale(6)}}
                  onPress={() => {
                    setStatus('buy');
                    setDetailProduct(item);
                    setVisible(true);
                  }}>
                  Buy Now
                </Button>
                <Button
                  appearance="outline"
                  onPress={() => {
                    setStatus('cart');
                    setDetailProduct(item);
                    setVisibleModalCart(true);
                  }}>
                  Add To Cart
                </Button>
              </View>
            </View>
          </View>
        </>
      ) : null}
      <Modal visible={visible} setVisible={() => setVisible(false)}>
        <View style={{marginBottom: moderateScale(12)}}>
          <Text style={{paddingBottom: moderateScale(12)}}>Quantity:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Quantity"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="qty"
            defaultValue=""
          />
          {errors.qty && <Text>This is required.</Text>}
        </View>
        <Button status="primary" onPress={handleSubmit(onSubmit)}>
          Buy Now
        </Button>
      </Modal>
      <Modal
        visible={visibleModalCart}
        setVisible={() => setVisibleModalCart(false)}>
        <View style={{marginBottom: moderateScale(12)}}>
          <Text style={{paddingBottom: moderateScale(12)}}>Quantity:</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Quantity"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="qty"
            defaultValue=""
          />
          {errors.qty && <Text>This is required.</Text>}
        </View>
        <Button status="success" onPress={handleSubmit(onSubmit)}>
          Add To Cart
        </Button>
      </Modal>
    </View>
  );
};

export default DetailProduct;

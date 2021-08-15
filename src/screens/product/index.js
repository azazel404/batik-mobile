import React from 'react';
import {View, FlatList, Alert, Image, Text} from 'react-native';
import {Input, Card, Button} from '@ui-kitten/components';
import {moderateScale} from '../../helpers/scaling';
import UserAPI from '../../api/UserAPI';
import Modal from '../../components/modal';
import {useForm, Controller} from 'react-hook-form';
import Loading from '../../components/spinner';
import ImageEmpty from '../../assets/undraw_not_found_60pq.svg';
import {URLFILE} from '../../../config';

const Product = ({navigation}) => {
  const [profile, setProfile] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [status, setStatus] = React.useState('');
  const [detailProduct, setDetailProduct] = React.useState({});
  const [value, setValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [visibleModalCart, setVisibleModalCart] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  React.useEffect(() => {
    setIsLoading(true);
    UserAPI.me()
      .then(res => {
        setProfile(res.data.data);
        let payload = {
          search: value,
        };
        UserAPI.products(payload)
          .then(res => {
            setProducts(res.data.data);
            setIsLoading(false);
          })
          .catch(err => {
            console.log('err', {err});
          });
      })
      .catch(err => {
        console.log('err', {err});
      });
  }, [value]);

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

  const renderItem = ({item}) => {
    return (
      <Card style={{marginVertical: moderateScale(6)}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              marginRight: moderateScale(12),
              paddingTop: moderateScale(6),
            }}>
            <Image
              style={{width: 100, height: 100, resizeMode: 'stretch'}}
              source={{
                uri: URLFILE + item.image,
              }}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text style={{color: 'blue', fontSize: moderateScale(16)}}>
              {item.name}
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: moderateScale(12),
                marginTop: moderateScale(8),
              }}>
              Price: {item.price}
            </Text>
            <Text style={{color: 'black', fontSize: moderateScale(12)}}>
              Stock: {item.stock}
            </Text>
            <Text style={{color: 'black', fontSize: moderateScale(12)}}>
              {item.description.length > 24
                ? item.description.substring(0, 24) + '..'
                : item.description}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: moderateScale(12),
              }}>
              <Button
                size="tiny"
                status="primary"
                onPress={() => {
                  navigation.navigate('Detail', {
                    item: item,
                  });
                }}
                style={{marginRight: moderateScale(6)}}>
                View More
              </Button>
              <Button
                size="tiny"
                appearance="outline"
                style={{marginRight: moderateScale(6)}}
                onPress={() => {
                  setStatus('buy');
                  setDetailProduct(item);
                  setVisible(true);
                }}>
                Buy Now
              </Button>
              <Button
                size="tiny"
                appearance="ghost"
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
      </Card>
    );
  };

  return (
    <View style={{flex: 1, padding: moderateScale(14)}}>
      <Text
        style={{
          fontSize: moderateScale(24),
          fontWeight: 'bold',
          marginTop: moderateScale(14),
        }}>
        Welcome
      </Text>
      <View style={{marginTop: moderateScale(8)}}>
        <Input
          placeholder="Search Your Product ..."
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />
      </View>
      <View style={{paddingTop: moderateScale(14)}}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {products.length > 0 ? (
              <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ImageEmpty
                  width={moderateScale(280)}
                  height={moderateScale(280)}
                />
                <Text> No Data</Text>
              </View>
            )}
          </>
        )}
      </View>
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
export default Product;

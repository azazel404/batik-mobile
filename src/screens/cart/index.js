import React from 'react';
import {View, FlatList, Alert, Image, Text} from 'react-native';
import {Icon, Input, Card, Button, CheckBox} from '@ui-kitten/components';
import {moderateScale} from '../../helpers/scaling';
import UserAPI from '../../api/UserAPI';
import Modal from '../../components/modal';
import Loading from '../../components/spinner';
import {useForm, Controller} from 'react-hook-form';
import ImageEmpty from '../../assets/undraw_not_found_60pq.svg';
import {URLFILE} from '../../../config';

const Cart = props => {
  const [carts, setCarts] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [detailCart, setDetailCart] = React.useState({});
  const [profile, setProfile] = React.useState({});
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = values => {
    let payload = {
      users_id: detailCart.users_id,
      product_id: detailCart.product_id,
      qty: values.qty,
    };
    UserAPI.updateCart(payload, detailCart.id)
      .then(res => {
        Alert.alert('Message', 'Successfully update to quantity');
        retrieveData();
      })
      .catch(err => {
        console.log('err', {err});
      });
  };

  const retrieveData = () => {
    setIsLoading(true);
    UserAPI.me()
      .then(res => {
        setProfile(res.data.data);
        let profile = res.data.data;
        UserAPI.carts()
          .then(res => {
            let data = res.data.data.filter(
              item => item.users_id === profile.id,
            );
            setCarts(data);
            setIsLoading(false);
          })
          .catch(err => {
            console.log('err', {err});
          });
      })
      .catch(err => {
        console.log('err', {err});
      });
  };

  React.useEffect(() => {
    retrieveData();
  }, []);

  const onDelete = id => {
    UserAPI.deleteCart(id)
      .then(res => {
        Alert.alert('Message', 'Successfully delete to cart');
        retrieveData();
      })
      .catch(err => {
        console.log('err', {err});
      });
  };

  const onClickCheckbox = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleBukOrder = () => {
    let cart = carts.filter(item => selected.includes(item.id));
    let payload = {
      requestOrder: cart.map(item => {
        return {
          ...item,
        };
      }),
    };
    UserAPI.bulkOrders(payload)
      .then(res => {
        Alert.alert('Message', 'Successfully Order');
        retrieveData();
      })
      .catch(err => {
        console.log('err', {err});
      });
  };

  const isSelected = id => selected.indexOf(id) !== -1;

  const renderItem = ({item}) => {
    const isItemSelected = isSelected(item.id);
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={{marginRight: moderateScale(8)}}>
            <CheckBox
              checked={isItemSelected}
              style={{color: 'white', backgroundColor: 'white'}}
              onChange={event => onClickCheckbox(event, item.id)}></CheckBox>
          </View>
          <Card style={{marginVertical: moderateScale(6), width: '100%'}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  marginRight: moderateScale(12),
                  paddingTop: moderateScale(6),
                }}>
                {item && (
                  <Image
                    style={{width: 100, height: 100, resizeMode: 'stretch'}}
                    source={{
                      uri: URLFILE + item.products.image,
                    }}
                  />
                )}
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={{color: 'blue', fontSize: moderateScale(16)}}>
                  {item && item.products.name}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: moderateScale(12),
                    marginTop: moderateScale(8),
                  }}>
                  Price: {item && item.products.price}
                </Text>
                <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                  Quantity: {item.qty}
                </Text>
                {/* <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                  {item && item.products.description.length > 24
                    ? item.products.description.substring(0, 24) + '..'
                    : item.products.description}
                </Text> */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: moderateScale(12),
                  }}>
                  <Button
                    status="danger"
                    size="tiny"
                    onPress={() => {
                      onDelete(item.id);
                    }}
                    style={{marginRight: moderateScale(12)}}>
                    Delete
                  </Button>
                  <Button
                    appearance="outline"
                    onPress={() => {
                      setDetailCart(item);
                      setVisible(true);
                    }}
                    size="tiny">
                    Update Quantity
                  </Button>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </>
    );
  };

  return (
    <View style={{flex: 1, padding: moderateScale(14)}}>
      <View style={{paddingTop: moderateScale(24), height: moderateScale(520)}}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {carts.length > 0 ? (
              <FlatList
                data={carts}
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
                  width={moderateScale(300)}
                  height={moderateScale(300)}
                />
                <Text> No Data</Text>
              </View>
            )}
          </>
        )}
      </View>
      {carts.length > 0 && (
        <View
          style={{
            marginTop: moderateScale(14),
          }}>
          <Button
            disabled={selected.length <= 0 ? true : false}
            status="primary"
            onPress={handleBukOrder}>
            Buy Now
          </Button>
        </View>
      )}
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
          Update Quantity
        </Button>
      </Modal>
    </View>
  );
};
export default Cart;

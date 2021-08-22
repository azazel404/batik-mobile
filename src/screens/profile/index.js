import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  Platform,
} from 'react-native';
import {Card, Button} from '@ui-kitten/components';
import UserAPI from '../../api/UserAPI';
import {moderateScale} from '../../helpers/scaling';
import Loading from '../../components/spinner';
import ImageEmpty from '../../assets/undraw_not_found_60pq.svg';
import {URLFILE} from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Profile = ({navigation}) => {
  const [profile, setProfile] = React.useState({});
  const [orders, setOrders] = React.useState([]);
  const [status, seStatus] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const choosePick = detailId => {
    let options = {
      includeBase64: true, //add this in the option to include base64 value in the response
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        setIsLoading(true);
        updateOrderWithDocument(response.assets[0], detailId);
      }
    });
  };

  const retrieveData = () => {
    setIsLoading(true);
    UserAPI.me()
      .then(res => {
        setProfile(res.data.data);
        let payload = {
          userId: res.data.data.id,
          status: status,
        };
        UserAPI.orders(payload)
          .then(res => {
            setOrders(res.data.data);
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

  const statusOrder = status => {
    let payload = {
      userId: profile.id,
      status: status,
    };
    UserAPI.orders(payload)
      .then(res => {
        setOrders(res.data.data);
      })
      .catch(err => {
        console.log('err', {err});
      });
  };

  const cancelOrder = item => {
    let payload = {
      status: 3,
    };
    UserAPI.cancelOrder(payload, item.id)
      .then(res => {
        Alert.alert('Message', 'Successfully cancel order');
        retrieveData();
      })
      .catch(err => {
        console.log('err', {err});
      });
  };

  const updateOrderWithDocument = (sourceImage, detailId) => {
    let image = {
      name: sourceImage.fileName,
      type: sourceImage.type,
      uri:
        Platform.OS === 'android'
          ? sourceImage.uri
          : sourceImage.uri.replace('file://', ''),
    };
    const formData = new FormData();
    formData.append('status', 0);
    formData.append('image', image);
    UserAPI.updateOrder(formData, detailId)
      .then(res => {
        Alert.alert('Message', 'Successfully Process');
        retrieveData();
      })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateOrder = item => {
    const formData = new FormData();
    formData.append('status', 2);

    UserAPI.updateOrder(formData, item.id)
      .then(res => {
        Alert.alert('Message', 'Successfully Process');
        retrieveData();
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const renderItem = ({item}) => {
    return (
      <Card style={{marginVertical: moderateScale(4)}}>
        {profile && (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                marginRight: moderateScale(12),
                paddingTop: moderateScale(6),
              }}>
              <Image
                style={{width: 100, height: 100, resizeMode: 'stretch'}}
                source={{
                  uri: URLFILE + item.products.image,
                }}
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: moderateScale(16),
                }}>
                Invoice: {item.code}
              </Text>

              <Text
                style={{
                  color: 'black',
                  fontSize: moderateScale(12),
                  marginTop: moderateScale(6),
                }}>
                Product: {item.products.name}
              </Text>
              {status === 1 && (
                <Text
                  style={{
                    color: 'black',
                    fontSize: moderateScale(12),
                    marginTop: moderateScale(6),
                  }}>
                  Courir: {item.drivers && item.drivers.name}
                </Text>
              )}
              {status === 1 && (
                <Text
                  style={{
                    color: 'black',
                    fontSize: moderateScale(12),
                    marginTop: moderateScale(6),
                  }}>
                  No Resi: {item.resi}
                </Text>
              )}

              <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                Start Date: {item.start_date}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                End Date: {item.end_date}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                Quantity: {item.qty}
              </Text>
              {status === 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: moderateScale(12),
                    }}>
                    <Button
                      size="tiny"
                      status="danger"
                      onPress={() => {
                        cancelOrder(item);
                      }}
                      style={{marginRight: moderateScale(4)}}>
                      Cancel Order
                    </Button>
                    {item.image !== null ? (
                      <Text
                        style={{
                          color: 'blue',
                          fontWeight: 'bold',
                          fontSize: moderateScale(12),
                        }}>
                        Verified Payment
                      </Text>
                    ) : (
                      <Button
                        size="tiny"
                        status="primary"
                        style={{marginRight: moderateScale(4)}}
                        onPress={() => {
                          choosePick(item.id);
                        }}>
                        Send proof of payment
                      </Button>
                    )}
                  </View>
                </>
              ) : status === 1 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: moderateScale(12),
                    }}>
                    <Button
                      size="tiny"
                      status="primary"
                      style={{marginRight: moderateScale(4)}}
                      onPress={() => {
                        updateOrder(item);
                      }}>
                      Set To Arrived
                    </Button>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'column', padding: 12}}>
        <View style={{marginBottom: 24}}>
          <Card>
            {profile && (
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text category="p1">Name:</Text>
                  <Text category="p1">Phone Number:</Text>
                  <Text category="p1">Email:</Text>
                  <Text category="p1">Address</Text>
                </View>
                <View style={{flexDirection: 'column', paddingLeft: 12}}>
                  <Text category="p1">{profile.name}</Text>

                  <Text category="p1">{profile.phone_number}</Text>
                  <Text category="p1">{profile.email}</Text>
                  <Text category="p1">{profile.address}</Text>
                </View>
              </View>
            )}
            <Button
              size="tiny"
              status="primary"
              style={{marginTop: moderateScale(14)}}
              onPress={async () => {
                await AsyncStorage.removeItem('token_login');
                await navigation.navigate('Login');
                // setStatus('buy');
                // setDetailProduct(item);
                // setVisible(true);
              }}>
              Logout
            </Button>
          </Card>
        </View>
        <View style={styles.containerStatus}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Card style={styles.card} status="primary">
              <TouchableOpacity
                onPress={() => {
                  statusOrder(0);
                  seStatus(0);
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: status === 0 ? 'blue' : 'black',
                    fontWeight: status === 0 ? 'bold' : 'normal',
                  }}>
                  To Pay
                </Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.card} status="success">
              <TouchableOpacity
                onPress={() => {
                  statusOrder(1);
                  seStatus(1);
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: status === 1 ? 'blue' : 'black',
                    fontWeight: status === 1 ? 'bold' : 'normal',
                  }}>
                  To Receive
                </Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.card} status="info">
              <TouchableOpacity
                onPress={() => {
                  statusOrder(2);
                  seStatus(2);
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: status === 2 ? 'blue' : 'black',
                    fontWeight: status === 2 ? 'bold' : 'normal',
                  }}>
                  Arrived
                </Text>
              </TouchableOpacity>
            </Card>

            <Card style={styles.card} status="warning">
              <TouchableOpacity
                onPress={() => {
                  statusOrder(3);
                  seStatus(3);
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: status === 3 ? 'blue' : 'black',
                    fontWeight: status === 3 ? 'bold' : 'normal',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </Card>
          </ScrollView>
        </View>
        <View
          style={{paddingTop: moderateScale(12), height: moderateScale(380)}}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {orders.length > 0 ? (
                <FlatList
                  data={orders}
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
                    width={moderateScale(230)}
                    height={moderateScale(230)}
                  />
                  <Text> No Data</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    margin: moderateScale(2),
  },
});

export default Profile;

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
} from 'react-native';
import {Card, Button} from '@ui-kitten/components';
import UserAPI from '../../api/UserAPI';
import {moderateScale} from '../../helpers/scaling';
import Loading from '../../components/spinner';
import ImageEmpty from '../../assets/undraw_not_found_60pq.svg';
import {URLFILE} from '../../../config';

const Profile = props => {
  const [profile, setProfile] = React.useState({});
  const [orders, setOrders] = React.useState([]);
  const [status, seStatus] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
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

  const renderItem = ({item}) => {
    return (
      <Card style={{marginVertical: moderateScale(6)}}>
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
              <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                Start Date: {item.start_date}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                End Date: {item.end_date}
              </Text>
              <Text style={{color: 'black', fontSize: moderateScale(12)}}>
                Quantity: {item.qty}
              </Text>
              {status === 0 && (
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
                      style={{marginRight: moderateScale(6)}}>
                      Cancel Order
                    </Button>
                    {/* <Button
                      size="tiny"
                      status="primary"
                      style={{marginRight: moderateScale(6)}}
                      onPress={() => {
                        // setStatus('buy');
                        // setDetailProduct(item);
                        // setVisible(true);
                      }}>t
                      Need to pay
                    </Button> */}
                  </View>
                </>
              )}
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
                  Cancelled
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
    margin: 2,
  },
});

export default Profile;

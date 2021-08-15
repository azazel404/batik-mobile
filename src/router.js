import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import Login from './screens/login';
import Register from './screens/register';
import ProductScreen from './screens/product';
import Cart from './screens/cart';
import Profile from './screens/profile';
import DetailProduct from './screens/product/detail';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Product') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return (
            // <Icon
            //   name={'facebook'}
            //   style={{height: 24, width: 24}}
            //   fill="white"
            // />
            <Icon name={iconName} type="ionicon" />
          );
        },
        unmountOnBlur: true,
      })}>
      <Tab.Screen
        name="Product"
        component={ProductScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Account" component={Profile} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function StackNavigation(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Home'}
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name={'Detail'} component={DetailProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

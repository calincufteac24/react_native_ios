import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'


import { View, Text } from 'react-native'
import { auth, onAuthStateChanged } from './firebase'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
import * as ScreenOrientation from 'expo-screen-orientation'

const store = createStore(rootReducer, applyMiddleware(thunk))

ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);

const Stack = createStackNavigator();

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount(){
    onAuthStateChanged(auth, (user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const {loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>
            Loading
          </Text>
        </View>
      )
    }
    if(!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Main">
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App



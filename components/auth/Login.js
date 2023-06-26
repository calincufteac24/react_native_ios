import React, { Component } from 'react'
import { View, Button, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Text, Image, Animated, } from 'react-native'
import { auth, signInWithEmailAndPassword } from '../../firebase'
import firebase from 'firebase/app';
import * as Notifications from 'expo-notifications'

const triggerNotifications = async () => {
  await Notifications.scheduleNotificationAsync({
  content: {
  title: "Congratulations !!! 🎊🍾",
  body: 'You logged in succesfully✅',
  data: { data: 'goes here' },
  },
  trigger: { seconds: 2 },
  });
}

  Notifications.setNotificationHandler({
    handleNotification: async () => {
    return {
    shouldShowAlert: true
    }}
  })




export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: ''
    }
    this.onSignup = this.onSignup.bind(this)
  }

  componentDidMount() {
    this.registerForPushNotifications();
  }

  registerForPushNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        return;
      }
    }
  };

  onSignup() {
    const { email, password} = this.state;
    signInWithEmailAndPassword(auth, email, password)
  }

  handleFacebookLogin = async () => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        await signInWithCredential(auth, credential); // Use the signInWithCredential function from firebase.js
      } else {
        // Handle canceled login or error
      }
    } catch (error) {
      // Handle error
    }
  }

   signInWithFB = async () => {
    try {
      await LoginManager.logInWithPermissions(['public_profile', 'email']);
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        return;
      }
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      const auth = getAuth();
      const response = await signInWithCredential(auth, facebookCredential);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }


  render() {
    return (
      <ImageBackground source={require('../../assets/f1.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome driver, let's login into your account</Text>
          <TextInput
            placeholder="Email"
            onChangeText = {(email) => this.setState({ email })}
            placeholderTextColor="rgb(96,96,96)"
            style={styles.TextInput}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry = {true}
            placeholderTextColor="rgb(96,96,96)"
            onChangeText = {(password) => this.setState({ password })}
            style={styles.TextInput}
          />

          <TouchableOpacity style={styles.button} onPress={() => {
            this.onSignup();
            triggerNotifications();
          }}>
            <Text style={styles.buttonText}>Sign-Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.signInWithFB}>
            <Text style={styles.buttonText}>Sign-in with Facebook</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
  },
  TextInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adjust opacity for desired blur effect // Adjust the blur intensity as needed
    padding: 15,
    marginBottom: 40,
    fontSize: 15,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontFamily: 'Verdana',
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: -1, height: 2},
    textShadowRadius: 5,
    textAlign: 'center',
    marginBottom: 200,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logo: {
    width: 88,
    height: 110,
    marginRight: 8,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
export default Login

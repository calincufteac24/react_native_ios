import React, { Component } from 'react'
import { View, Button, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Text, } from 'react-native'

import { auth, createUserWithEmailAndPassword, firestore, doc, setDoc } from '../../firebase'


export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: '',
        name: '',
        description: '',
        results: '',
        team: ''
    }
    this.onSignup = this.onSignup.bind(this)
  }
  onSignup() {
    const { email, password, name, description, results, team } = this.state;
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        setDoc(doc(firestore, "users", auth.currentUser.uid), {
          name,
          email,
          description,
          results,
          team
      });
      })
      .catch((error) => {
        console.log(error)
      })
    }
  render() {
    return (
      <ImageBackground source={require('../../assets/f1.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
        <Text style={styles.title}>Let's Register !</Text>
          <TextInput
            style= {styles.TextInput}
            placeholder="Name"
            onChangeText = {(name) => this.setState({ name })}
            placeholderTextColor="rgb(96,96,96)"
          />
          <TextInput
            style= {styles.TextInput}
            placeholder="Email"
            onChangeText = {(email) => this.setState({ email })}
            placeholderTextColor="rgb(96,96,96)"
          />
          <TextInput
            style= {styles.TextInput}
            placeholder="Password"
            secureTextEntry = {true}
            placeholderTextColor="rgb(96,96,96)"
            onChangeText = {(password) => this.setState({ password })}
          />
          <TextInput
            style= {styles.TextInput}
            placeholder="Description"
            onChangeText = {(description) => this.setState({ description })}
            placeholderTextColor="rgb(96,96,96)"
          />
          <TextInput
            style= {styles.TextInput}
            placeholder="Results"
            onChangeText = {(results) => this.setState({ results })}
            placeholderTextColor="rgb(96,96,96)"
          />
          <TextInput
            style= {styles.TextInput}
            placeholder="Team"
            onChangeText = {(team) => this.setState({ team })}
            placeholderTextColor="rgb(96,96,96)"
          />
          <TouchableOpacity style={styles.button} onPress={() => this.onSignup()}>
            <Text style={styles.buttonText}>Sign-Up</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adjust opacity for desired blur effect
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
    marginBottom: 20,
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

export default Register

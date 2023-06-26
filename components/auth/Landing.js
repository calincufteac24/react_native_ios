import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Image, Animated, Button } from 'react-native';
import { getAuth, FacebookAuthProvider, signInWithPopup } from '../../firebase'
import { LogBox } from 'react-native';


const Landing = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [opacityValue, setOpacityValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const titleText = 'GranPrix';
    const subtitleText = 'Legends';
    let titleCounter = 0;
    let subtitleCounter = 0;
    let titleInterval, subtitleInterval;

    titleInterval = setInterval(() => {
      setTitle(titleText.substring(0, titleCounter));
      titleCounter++;
      if (titleCounter > titleText.length) {
        clearInterval(titleInterval);
      }
    }, 100);

    setTimeout(() => {
      const subtitleInterval = setInterval(() => {
        setSubtitle(subtitleText.substring(0, subtitleCounter));
        subtitleCounter++;
        if (subtitleCounter > subtitleText.length) {
          clearInterval(subtitleInterval);
        }
      }, 80);
    }, 1000);

    // Start the animation after a delay
    setTimeout(() => {
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1800);

    return () => {
      clearInterval(titleInterval);
      clearInterval(subtitleInterval);
    };
  }, []);


  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  return (
    <ImageBackground source={require('../../assets/f1.png')} style={styles.backgroundImage}>
      <View style={styles.titleContainer}>
        <Image style={styles.logo} source={require('../../assets/f1logo.png')} />
        <View style={styles.titleColumn}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Animated.View style={{ opacity: opacityValue }}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  titleContainer: {
    height: 80,
    marginTop: 60,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginEnd: 40,
    fontFamily: 'Verdana',
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: -1, height: 2},
    textShadowRadius: 5,
  },
  subtitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginStart: 70,
    fontFamily: 'Verdana',
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: 320,
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

export default Landing;



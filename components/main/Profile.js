import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, ScrollView, Modal, ImageBackground } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';


import { connect } from 'react-redux'
import { firestore, doc, getDoc, auth, collection, getDocs, setDoc, deleteDoc, signOut } from '../../firebase'


 function Profile(props) {
  const[userPosts, setUserPosts] = useState([]);
  const[user, setUser] = useState([null]);
  const[following, setFollowing] = useState(false)
  const[showMap, setShowMap] = useState(false);
  const[recording, setRecording] = useState();
  const[recordings, setRecordings] = useState([]);
  const[message, setMessage] = useState("");
  const[showWebView, setShowWebView] = useState(false);



  const toggleMapWindow = () => {
    setShowMap(!showMap);
  };
  const handleWebViewToggle = () => {
    setShowWebView(!showWebView);
  };

  useEffect(() => {
    const {currentUser, posts} = props

    if(props.route.params.uid == auth.currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    }
    else {
      const userRef = doc(firestore, "users", props.route.params.uid);
      getDoc(userRef)
        .then((snapshot) => {
        if(snapshot.exists()){
          setUser(snapshot.data())
        }
        else {
          console.log('does not exist')
        }
      })
      const postsRef = doc(firestore, "posts", props.route.params.uid);
      const userPostsRef = collection(postsRef, "userPosts");
      getDocs(userPostsRef)
        .then((snapshot) => {
        if(snapshot){
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const id = doc.id;
            return {id, ...data}
          })
          setUserPosts(posts)
        }
        else {
          console.log('does not exist')
        }
      })
    }

    if(props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false)
    }

  }, [props.route.params.uid, props.following])

  const onFollow = () => {
    const followingRef = doc(collection(firestore, 'following', auth.currentUser.uid, 'userFollowing'), props.route.params.uid);
    setDoc(followingRef, {});
  }

  const onUnFollow = () => {
    const followingRef = doc(collection(firestore, "following", auth.currentUser.uid, "userFollowing"), props.route.params.uid);
    deleteDoc(followingRef);
  }

  const onLogout =  () => {
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
  }

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if( permission.status === "granted") {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: true
        });
        const { recording } = await Audio.Recording.createAsync( Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY );
        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to acces microfon")
      }
    } catch (err) {
      console.error("Failes to start recording", err)
    }

  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [... recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
      updatedRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI()
    });
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration} </Text>
          <Button style={styles.button} onPress={ () => recordingLine.sound.replayAsync()} title="Play"></Button>
          <Button style={styles.button} onPress={ () => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
        </View>
      )
    });
  }


  if(user ===null) {
    return  <View/>
  }
  return (
      <View style={styles.container}>
        { props.route.params.uid !== auth.currentUser.uid ? (
              <View style={styles.containerLog}>
                { following ? (
                    <Button
                      title="Following"
                      onPress={() => onUnFollow()}
                    />
                ) : (
                  <Button
                  title="Follow"
                  onPress={() => onFollow()}
                />
                ) }
                </View>
            ) :
            <View style={styles.containerLog}>
              <TouchableOpacity
                style= {styles.buttonLogout}
                title="Logout"
                onPress={() => onLogout()}
                >
                  <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          }

        <ScrollView>
          <View style={styles.containerInfo}>
            <Text style={styles.borderText}> { user.name } </Text>
            <Text style={styles.borderText}> { user.description } </Text>
            <Text style={styles.borderText}> { user.results } </Text>
            <Text style={styles.borderText}> { user.team } </Text>

            {!showMap ? (
              <TouchableOpacity style={styles.buttonLogout} onPress={toggleMapWindow} >
                <Text style={styles.buttonText}>See map</Text>
              </TouchableOpacity>
          ) : (
            <Modal visible={showMap} animationType="slide">
              <View style={{ flex: 1 }}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 45.79765,
                    longitude: 24.14409,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: 45.79765, longitude: 24.14409 }}
                    title="UNITEL SRL, Sibiu"
                    description="Marker for Darstelor nr 6, Sibiu"
                  />
                  <TouchableOpacity style={styles.buttonContainer} onPress={toggleMapWindow} >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </MapView>
              </View>
            </Modal>
          )}


          {!showWebView ? (
            <TouchableOpacity style={styles.buttonLogout} onPress={handleWebViewToggle} >
              <Text style={styles.buttonText}>See more details</Text>
            </TouchableOpacity>
          ) : (
            <Modal visible={showWebView} animationType="slide">
              <View style={{ flex: 1 }}>
                <WebView
                  source={{ uri: 'https://en.wikipedia.org/wiki/Lewis_Hamilton' }}
                />
 p               <TouchableOpacity style={styles.buttonContainer} onPress={handleWebViewToggle} >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}

          <TouchableOpacity
            style={styles.buttonRecording}
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.buttonText}>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>
              {getRecordingLines()}
          </View>

          <View style={styles.containerGallery}>
            <FlatList
                scrollEnabled={false}
                numColumns={3}
                horizontal={false}
                data={userPosts}
                renderItem={({item}) => (
                  <View style={styles.containerImage}>
                    <Image
                      style={ styles.image }
                        source={{uri: item.downloadURL}}
                    />
                  </View>
                )}
            />
          </View>
          </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  borderText: {
    borderWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    padding: 20,
    fontWeight: '500',
    color: '#000',
    fontSize: 20,
  },
  buttonRecording: {
    backgroundColor: 'red',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  containerLog: {
    top: 0,
    right: 0,
    padding: 10,
    display: 'flex'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    padding: 10,
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonLogout: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  mapContainer: {
    height: 240,
    marginBottom: 30,
    },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1/3
  },
  image: {
    flex: 1,
    aspectRatio: 1/1,
    width: '95%',
    margin: 10,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16
  },
  button: {
    margin: 16
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);

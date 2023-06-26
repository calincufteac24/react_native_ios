import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import { firestore, doc, getDoc, auth, collection, getDocs, setDoc, deleteDoc } from '../../firebase'
import * as Animatable from 'react-native-animatable';
const AnimatableText = Animatable.createAnimatableComponent(Text);

import { connect } from 'react-redux'


 function Feed(props) {
  const[posts, setPosts] = useState([]);

  useEffect(() => {
    let posts = [];
    if(props.usersLoaded == props.following.length && props.following.length !== 0) {
      setPosts(props.feed);
    }
  }, [props.usersLoaded, props.feed])

  const onLikePress = (userId, postId) => {
    const likesRef = doc(collection(firestore, "posts"), userId, "userPosts", postId, "likes", auth.currentUser.uid);
    setDoc(likesRef, {})
  }
  const onDislikePress = (userId, postId) => {
    const likesRef = doc(collection(firestore, "posts"), userId, "userPosts", postId, "likes", auth.currentUser.uid);
    deleteDoc(likesRef, {})
  }

  return (
    <ImageBackground source={require('../../assets/f12.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.containerGallery}>
          <FlatList
              numColumns={1}
              horizontal={false}
              data={posts}
              renderItem={( {item} ) => (
                <View style={styles.containerImage}>
                  <Text style={styles.title}> {item.user.name} </Text>
                  <Image
                    style={ styles.image }
                      source={{uri: item.downloadURL}}
                  />
                  {
                  item.currentUserLike ? (
                    <TouchableOpacity style={styles.button} onPress={() => onDislikePress(item.user.uid, item.id)}>
                      <AnimatableText style={styles.buttonText} animation="zoomInUp">Dislike</AnimatableText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.button} onPress={() =>  onLikePress(item.user.uid, item.id)}>
                      <Animatable.Text
                        style={styles.buttonText}
                        animation={{
                          0: {
                            scale: 0,
                            opacity: 0,
                          },
                          0.5: {
                            scale: 1.5,
                            opacity: 0.7,
                          },
                          1: {
                            scale: 1,
                            opacity: 1,
                          },
                        }}
                        iterationCount="infinite"
                        duration={3000}
                        useNativeDriver
                      >
                        Like
                      </Animatable.Text>
                    </TouchableOpacity>
                  )


                  }

                </View>
              )}
          />
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
    marginStart: 10,
    borderRadius: 20, // Border radius value to create rounded corners
  },
  title: {
    color: '#000',
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Verdana',
    marginTop: 40,
  },
  button: {

    borderWidth: 1,
    borderColor: 'blue',
    marginLeft: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  buttonText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed);

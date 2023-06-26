import React, { useState } from 'react'
import { View, TextInput, Image, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, firestore, app, doc, addDoc, collection, serverTimestamp } from '../../firebase'

const storage = getStorage(app)

export default function Save(props) {
  const { navigation } = props;
  const [caption, setCaption] = useState("")

  const uploadImage = async () => {
    const uri = props.route.params.image
    const response = await fetch(uri)
    const blob = await response.blob();
    const storageRef = ref(storage, `post/${auth.currentUser.uid}/${Math.random().toString(36)}`);

    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed',
    (snapshot) => {
      // Track the upload progress here if needed
    },
    (error) => {
      // Handle any errors here
    },
    () => {
      // When the upload completes, get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        savePostData(downloadURL);
      });
    }
  );


  const savePostData = (downloadURL) => {
    addDoc(collection(firestore, "posts", auth.currentUser.uid, "userPosts"), {
      downloadURL: downloadURL,
      caption: caption,
      creation: serverTimestamp(),
    }).then(() => {
      navigation.popToTop();
    })
  };
}

  return (
    <ImageBackground source={require('../../assets/f12.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source = {{uri: props.route.params.image}} />
        <TextInput
          style={styles.TextInput}
          placeholder= "Write a Caption..."
          onChangeText= {(caption) => setCaption(caption)} />
          <TouchableOpacity style={styles.button} onPress={() => uploadImage() }>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    width: 320,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  TextInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adjust opacity for desired blur effect
    padding: 15,
    marginBottom: 100,
    fontSize: 15,
  }
})

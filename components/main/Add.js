import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Add({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  const takePicture = async() => {
    if(camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  return (
    <View style={styles.container}>
      <Camera
          ref = {ref => setCamera(ref)}
          style={styles.camera}
          type={type}>
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.text}>Pick Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Save', { image })}>
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>


          <View style={{position: 'absolute', top: 10, right: 10}}>
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            )}
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  camera: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 60,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 10,
    margin: 10
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  imageContainer: {
    width: 100,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
});

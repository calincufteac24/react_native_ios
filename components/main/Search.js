
import React, {useState} from 'react'
import { View, Text, Image, FlatList, ImageBackground, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { firestore, getDocs, collection, query, where } from '../../firebase'

export default function Search(props) {
  const [users, setUsers] = useState([])
  const fetchUsers = (search) => {
    const q = query(collection(firestore, 'users'), where('name', '>=', search));
    getDocs(q)
      .then((snapshot) => {
        let users = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data}
        })
        setUsers(users);
      })
      .catch((error) => {
        console.log('Error fetching users: ', error);
      });
  }

  return (
    <ImageBackground source={require('../../assets/f12.jpeg')} style={styles.backgroundImage}>
      <View style= {styles.container}>
        <TextInput
          style= {styles.TextInput}
          placeholder="Type Here..."
          placeholderTextColor="rgb(96,96,96)"
          onChangeText={(search)=> fetchUsers(search)}
        />
          <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({item}) => (
              <TouchableOpacity
                  style= {styles.button}
                  onPress={() => props.navigation.navigate("Profile", {uid: item.id}) }>
                <Text style={styles.buttonText}> {item.name} </Text>
              </TouchableOpacity>
            )}
          />
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
  },
  TextInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adjust opacity for desired blur effect
    padding: 15,
    marginBottom: 10,
    fontSize: 15,
  }
})

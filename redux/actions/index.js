import { onSnapshot } from 'firebase/firestore';
import { firestore, doc, getDoc, auth, collection, getDocs } from '../../firebase'
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE } from  '../constants/index'


export function clearData() {
  return ((dispatch) => {
    dispatch({ type: CLEAR_DATA })
  })
}

export function fetchUser(){
  return(dispatch) => {
    const userRef = doc(firestore, "users", auth.currentUser.uid);
    getDoc(userRef)
      .then((snapshot) => {
      if(snapshot.exists()){
        dispatch({
          type: USER_STATE_CHANGE, currentUser: snapshot.data()
        })
      }
      else {
        console.log('does not exist')
      }
    })
  }
}

export function fetchUserPosts(){
  return(dispatch) => {
    const userRef = doc(firestore, "posts", auth.currentUser.uid);
    const userPostsRef = collection(userRef, "userPosts");
    getDocs(userPostsRef)
      .then((snapshot) => {
      if(snapshot){
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data}
        })
        dispatch({type: USER_POSTS_STATE_CHANGE, posts})
      }
      else {
        console.log('does not exist')
      }
    })
  }
}

export function fetchUserFollowing(){
  return(dispatch) => {
    const userRef = doc(firestore, "following", auth.currentUser.uid);
    const userFollowRef = collection(userRef, "userFollowing");
     onSnapshot(userFollowRef, (snapshot) => {
      if(snapshot){
        let following = snapshot.docs.map(doc => {
          const id = doc.id;
          return id
        })
        dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
        for( let i = 0 ; i < following.length; i++) {
          dispatch(fetchUsersData(following[i]));
        }
      }
      else {
        console.log('does not exist')
      }
    })
  }
}

export function fetchUsersData(uid) {
  return(dispatch, getState)=> {
    const found = getState().usersState.users.some(el => el.uid === uid);
    if(!found) {
      const userRef = doc(firestore, "users", uid);
      getDoc(userRef)
        .then((snapshot) => {
          let user = snapshot.data();
          user.uid = snapshot.id
          dispatch({type: USERS_DATA_STATE_CHANGE, user});
          dispatch(fetchUsersFollowingPosts(user.uid));
      })
    }
  }
}
export function fetchUsersFollowingPosts(uid){
  return (dispatch, getState) => {
    const userRef = doc(firestore, "posts", uid);
    const userPostsRef = collection(userRef, "userPosts");
    getDocs(userPostsRef)
      .then((snapshot) => {
        let uid, user;
        if (snapshot.docs[0]) {
          uid = snapshot.docs[0].ref.path.split('/')[1];
          user = getState().usersState.users.find(el => el.uid === uid);
        }

      if(snapshot){
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data, user}
        })
        for (let i =0; i<posts.length; i++) {
          dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
        }
        dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid})
      }
      else {
        console.log('does not exist')
      }
    })
  }
}

export function fetchUsersFollowingLikes(uid, postId) {
  return (dispatch) => {
    const likesRef = doc(
      collection(firestore, "posts"),
      uid,
      "userPosts",
      postId,
      "likes",
      auth.currentUser.uid
    );
    onSnapshot(likesRef, (snapshot) => {
      dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike: snapshot.exists() });
    });
  };
}




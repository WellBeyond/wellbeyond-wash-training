import 'firebase/auth';
import 'firebase/firestore';
import {TrainingSession} from "../../models/Training";
import {Admin, UserProfile} from "../../models/User";
import {FormSession, Form} from "../../models/Form";
import firebase from "firebase/app";
import {TrainingSessions} from "../training/training.state";
import {FormSessions} from "../form/form.state";

let unsubUser:any, unsubAdmin:any, unsubLessons:any, unsubTrainingSessions:any, unsubFormSessions:any, unsubForms:any;

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};
export const loginWithEmail = (email:string, password:string) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};
export const sendPasswordResetEmail = (email:string) => {
  return firebase.auth().sendPasswordResetEmail(email);
};
export const logout = () => {
  if (unsubUser) {
    unsubUser();
  }
  if (unsubAdmin) {
    unsubAdmin();
  }
  if (unsubLessons) {
    unsubLessons();
  }
  if (unsubTrainingSessions) {
    unsubTrainingSessions();
  }
  if (unsubFormSessions) {
    unsubFormSessions();
  }
  if (unsubForms) {
    unsubForms();
  }
  return firebase.auth().signOut();
};

export const authCheck = async (callback: any) => {
  return new Promise(resolve => {
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        return resolve(await callback(user));
      } else {
        callback(null);
        return resolve(null);
      }
    });
  });
};

export const listenForUserProfile = async (callback:any) : Promise<any> => {
  const user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }

  return unsubUser = firebase.firestore()
    .collection('users')
    .doc(user.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const profile = {
          id: user.uid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          name: user.displayName,
          photoURL: user.photoURL
        } as UserProfile;
        Object.assign(profile, doc.data());
        callback(profile);
      }
      else {
        callback();
      }
    });
};

export const listenForTrainingSessions = async (callback:any) : Promise<any> => {
  const user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }

  const results = {} as TrainingSessions;
  const query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore()
    .collection('sessions')
    .where('userId', '==', user.uid);
  return unsubTrainingSessions = query
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const data = {id: doc.id, ...doc.data()} as TrainingSession;
          if (!data.archived) {
            // @ts-ignore id is always defined
            results[data.id] = data;
          }
        }
      });
      callback(results);
    });
};

export const listenForFormSessions = async (callback:any) : Promise<any> => {
  const user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  const results = {} as FormSessions;
  const query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore()
    .collection('formSessions')
    .where('userId', '==', user.uid);

  return unsubFormSessions = query
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(function(doc) {

        if (doc.exists) {
          const data = {id: doc.id, ...doc.data()} as FormSession;
          if (!data.archived) {
            // @ts-ignore id is always defined
            results[data.id] = data;
          }
        }
      });
      callback(results);
    });
};

export const listenForForms = async (callback:any) : Promise<any> => {
  const user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  const results = {} as Form;
  const query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore()
    .collection('forms')
    .where('userId', '==', user.uid);

  return unsubForms = query
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(function(doc) {

        if (doc.exists) {
          const data = {id: doc.id, ...doc.data()} as Form;
          if (!data.archived) {
            // @ts-ignore id is always defined
            results[data.id] = data;
          }
        }
      });
      callback(results);
    });
};

/**
 *
 * @param email
 * @param password
 */
export const registerWithEmail = async (email: string, password: string) => {
  console.log("in registerWithEmail");
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password).catch(err => {
    console.log(err);
    if (err.code === 'auth/email-already-in-use') {
      loginWithEmail(email, password).catch(_err2 => { // Try to login using the provided password instead
        throw(err); // Throw the original error if it failed
      })
    }
    else {
      throw(err);
    }
  });
};

/**
 *
 */
export const getUserProfile:() => Promise<UserProfile | void> = async () => {
  let user = firebase.auth().currentUser;
  console.log(user);

  if (!user || !user.uid) {
    return;
  }

  const userRef = firebase
    .firestore()
    .collection("users")
    .doc(user ? user.uid : undefined);

  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return {
          ...doc.data(),
          id: user ? user.uid : undefined,
          email: user ? user.email : undefined,
          phoneNumber: user ? user.phoneNumber : undefined,
          name: user ? user.displayName : undefined,
          photoURL: user ? user.photoURL : undefined
        } as UserProfile;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!", user ? user.uid : undefined);
        return;
      }
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
};


export const getAdminProfile:() => Promise<Admin> = async () => {
  let user = firebase.auth().currentUser;
  console.log(user);

  if (!user || !user.uid) {
    return {id: ''} as Admin;
  }

  return firebase
    .firestore()
    .collection("admins")
    .doc(user.uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return ({...doc.data(), id: user && user.uid} as Admin);
      } else {
        return  {id: user && user.uid} as Admin;
      }
    })
    .catch(() => {
      return {id: user && user.uid} as Admin;
    });
};

export const checkIsAdmin = async () => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return false;
  }

  return firebase
    .firestore()
    .collection("admins")
    .doc(user.uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return (doc.data() || {}).isAdmin;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
};

export const updateEmail = async (email: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  return user
    .updateEmail(email)
    .then(() => {
      return firebase
        .firestore()
        .collection("users")
        // @ts-ignore
        .doc(user.uid)
        .set({
          // @ts-ignore
          email: email
        }, {merge: true})
        .then(() => {
          return user;
        });
    });
};

export const updateProfile = async (profile: Partial<UserProfile>) => {
  const user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve(undefined);
  }

  const updateAuthIfNecessary = async () => {
    let doUpdate = false;
    if (user && profile.name && profile.name !== user.displayName) {
      doUpdate = true;
    }
    if (user && profile.photoURL && profile.photoURL !== user.photoURL) {
      doUpdate = true;
    }
    if (user && doUpdate) {
      return user.updateProfile({displayName: profile.name, photoURL: profile.photoURL});
    }
    return Promise.resolve(undefined);
  }

  return updateAuthIfNecessary()
    .then(() => {
      let update = {
        ...profile,
        email: profile.email || user.email,
        phoneNumber: profile.phoneNumber || user.phoneNumber,
        name: profile.name || user.displayName
      } as UserProfile;
      // @ts-ignore
      Object.keys(update).forEach(key => update[key] === undefined && delete update[key]); // Remove any undefined
      return firebase
        .firestore()
        .collection("users")
        // @ts-ignore
        .doc(user.uid)
        .set(update, {merge: true})
        .then(() => {
          return update;
        });
    });
};

export const reauthenticateWithPassword = async (password: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.email) {
    return null;
  }
  const cred = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(cred);
}

export const updatePassword = async (password: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.email) {
    return null;
  }
  // @ts-ignore
  user.updatePassword(password)
    .then(() => {
      return user;
    });
};

export const createOrUpdateTrainingSession = async (session:TrainingSession) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  session.started = session.started || new Date();
  if (!session.id) {
    session.id = (user && user.uid) + ':' + session.subjectId + ':' + session.started.getTime();
  }
  return firebase
    .firestore()
    .collection('sessions')
    .doc(session.id)
    .set(session, {merge: true})
    .then(() => {
      return session;
    })
}


export const createOrUpdateFormSession = async (formSession:FormSession) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  formSession.started = formSession.started || new Date();
  if (!formSession.id) {
    formSession.id = (user && user.uid) + ':' + formSession.formTypeId + ':' + formSession.started.getTime();
  }
  return firebase
    .firestore()
    .collection('formSessions')
    .doc(formSession.id)
    .set(formSession, {merge: true})
    .then(() => {
      return formSession;
    })
    .catch(error => {
      console.log("Error writing document:", error);
    });
}

export const createOrUpdateForms = async (formSession:FormSession) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  formSession.started = formSession.started || new Date();
  if (!formSession.id) {
    formSession.id = (user && user.uid) + ':' + formSession.formTypeId + ':' + formSession.started.getTime();
  }
  return firebase
    .firestore()
    .collection('formSessions')
    .doc(formSession.id)
    .set(formSession, {merge: true})
    .then(() => {
      return;
    })
    .catch(error => {
      console.log("Error writing document:", error);
    });
}

export const listenForOrganizationData = async (callback:any) : Promise<any> => {
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('organizations');
  return query
    .onSnapshot(querySnapshot => {
      let results:any[] = [];
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(results);
    });
};

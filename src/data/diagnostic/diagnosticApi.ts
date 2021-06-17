import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {DiagnosticLog} from '../../models/Diagnostic';
import {checkIsAdmin} from "../user/userApi";
import {DiagnosticLogs} from "./diagnostic.state";
import { System } from '../../models/Maintenance';

export const listenForDiagnosticData = async (collectionPath:string, organizationId:string, callback:any) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection(collectionPath);
  if (!isAdmin) {
    query = query.where('organizationId', '==', organizationId);
  }
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

export const listenForDiagnosticLogs = async (system:System, callback:any) : Promise<any> => {
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore()
    .collection('diagnosticLogs')
    .where('organizationId', '==', system.organizationId)
    .where('systemId', '==', system.id);
  return query
    .onSnapshot(querySnapshot => {
      const results:DiagnosticLogs = {};
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.exists) {
          const data = {id: doc.id, ...doc.data()} as DiagnosticLog;
          if (!data.archived) {
            results[doc.id] = data;
          }
        }
      });
      callback(results);
    });
};

export const createOrUpdateDiagnosticLog = async (log:DiagnosticLog) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  log.userId  = log.userId  || user.uid;
  return firebase
    .firestore()
    .collection('diagnosticLogs')
    .doc(log.id)
    .set(log, {merge: true})
    .then(() => {
      return log;
    })
    .catch(error => {
      console.log("Error writing document:", error);
    });
}



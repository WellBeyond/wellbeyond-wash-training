import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {Form, FormType } from '../../models/Form';
import {checkIsAdmin} from "../user/userApi";
import {isPlatform} from "@ionic/react";

export const listenForFormTypeData = async (collectionPath:string, organizationId:string, callback:any) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection(collectionPath);
  if(!isAdmin) {
    if (collectionPath !== 'formTypes') {
      query = query.where('isPublished', '==', true);
    }
  }
  try {
  const result = query
    .onSnapshot(querySnapshot => {
      let results:any[] = [];
      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      const formData:any = {};
      formData[collectionPath] = results;
      cacheImagesAndVideos(formData as FormData);

      callback(results);
    });
    return result
  } catch (e) {
      console.log(e)
  }
};

interface FormData {
  forms?: Form[];
  formTypes?: FormType[];
}

export const listenForFormData = async (collectionPath:string, formTypeId:string, callback:any) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> =
    firebase.firestore().collection(collectionPath)
      .where('formTypeId', '==', formTypeId);
      if(!isAdmin) {
        if (collectionPath !== 'formTypes') {
          query = query.where('isPublished', '==', true);
        }
      }
  return query
    .onSnapshot(querySnapshot => {
      let results:any[] = [];
      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      const formData:any = {};
      formData[collectionPath] = results;
      cacheImagesAndVideos(formData as FormData);

      callback(results);
    });
};

export const cacheImagesAndVideos = ({forms, formTypes}:FormData) => {
  if (isPlatform('hybrid')) {
    return;
  }

  const images:string[] = [];
  const videos:string[] = [];
  if (forms && forms.length) {
    forms.forEach(form => {
      if (form.photos && form.photos.length) {
        form.photos.forEach(photo => {
          photo.url && images.push(photo.url);
        });
      }
      if (form.questions && form.questions.length) {
        form.questions.forEach(question => {
          question.photo && images.push(question.photo);
        });
      }
    });
  }
  addImagesToCache(images).then(() => {
    addVideosToCache(videos).catch(error =>  {
      console.log(error);
    });
  }).catch(error =>  {
    console.log(error);
  });
};

export const addVideosToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('video-cache');
  cache.addAll(urls);
}

export const addImagesToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('image-cache');
  cache.addAll(urls);
}
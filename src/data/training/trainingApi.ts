import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {Lesson, Subject, Topic} from '../../models/Training';
import {getLessonIconUrl} from "../../util/cloudinary";
import {checkIsAdmin} from "../user/userApi";
import {isPlatform} from "@ionic/react";

let topicListener:any;
let subjectListener:any;
let lessonListener:any;

export const listenForTrainingTopics = async (callback:any) : Promise<any> => {
  if (topicListener && typeof topicListener === 'function') {
    topicListener();
    topicListener = undefined;
  }
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('topics');
    topicListener = query
    .onSnapshot(querySnapshot => {
      let results:Topic[] = [];
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        results.push({
          id: doc.id,
          ...doc.data()
        } as Topic);
      });
      cacheImagesAndVideos({topics: results} as TrainingData);
      callback(results);
    });
};

export const listenForTrainingSubjects = async (organizationId: string, callback:any) : Promise<any> => {
  if (subjectListener && typeof subjectListener === 'function') {
    subjectListener();
    subjectListener = undefined;
  }

  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('subjects');
  if (!isAdmin) {
    query = query.where('isPublished', '==', true);
  }
  return query
    .onSnapshot(querySnapshot => {
      let results:Subject[] = [];
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        const row = {
          id: doc.id,
          ...doc.data()
        } as Subject;
        if (isAdmin || row.organizationId === organizationId ||
          (row.organizations && row.organizations.includes(organizationId))) {
          results.push(row);
        }
      });
      cacheImagesAndVideos({topics: results} as TrainingData);
      callback(results);
    });
};

export const listenForTrainingLessons = async (subjects: Subject[], callback:any) : Promise<any> => {
  if (lessonListener && typeof lessonListener === 'function') {
    lessonListener();
    lessonListener = undefined;
  }
  const lessonIds:string[] = [];
  subjects.forEach((subject) => {
    if (subject.lessons) {
      subject.lessons.forEach((l) => {l.lessonId && lessonIds.push(l.lessonId)});
    }
  });
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('lessons');
  if (!isAdmin) {
    query = query.where('isPublished', '==', true);
  }
  if (lessonIds.length && lessonIds.length < 11) {
    query = query.where(firebase.firestore.FieldPath.documentId(), 'in', lessonIds);
  }
  return query
    .onSnapshot(querySnapshot => {
      let results:Lesson[] = [];
      querySnapshot.forEach(doc => {
        const row = {
          id: doc.id,
          ...doc.data()
        } as Lesson;
        if (isAdmin || lessonIds.includes(row.id)) {
          results.push(row);
        }
      });
      cacheImagesAndVideos({lessons: results} as TrainingData);
      callback(results);
    });
};

interface TrainingData {
  topics?: Topic[];
  subjects?: Subject[];
  lessons?: Lesson[];
}

export const cacheImagesAndVideos = ({topics, subjects, lessons}:TrainingData) => {
  if (isPlatform('hybrid')) {
    return;
  }
  const images:string[] = [];
  const videos:string[] = [];
  if (lessons && lessons.length) {
    lessons.forEach(lesson => {
      if (lesson.photo) {
        images.push(getLessonIconUrl(lesson.photo, false));
        images.push(getLessonIconUrl(lesson.photo, true));
      }
      if (lesson.pages && lesson.pages.length) {
        lesson.pages.forEach(page => {
          page.photo && images.push(page.photo);
          page.video && videos.push(page.video);
        });
      }
    });
  }
  if (subjects && subjects.length) {
    subjects.forEach(subject => {
      subject.photo && images.push(subject.photo);
    });
  }
  if (topics && topics.length) {
    topics.forEach(topic => {
      topic.photo && images.push(topic.photo);
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



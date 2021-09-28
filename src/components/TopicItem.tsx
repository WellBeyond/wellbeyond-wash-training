import React from 'react';
import {Topic} from '../models/Training';
import {IonCard, IonCardContent, IonItem, IonLabel} from '@ionic/react';
import {Image} from "cloudinary-react";
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";
import {getPublicId} from "../util/cloudinary";


interface TopicItemProps {
  topic: Topic;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic}) => {
  return (
    <IonItem button detail={false} lines="none" className="topic-item" routerLink={`/tabs/training?topicId=${topic.id}`}>
      <IonCard className="topic-card">
        <IonCardContent>
          <Image
            alt={topic.name}
            cloudName={cloudinaryConfig.cloudName}
            publicId={getPublicId(topic.photo)}
            quality="auto"
            width="auto"
            crop="scale"/>
        </IonCardContent>
        <IonLabel className="ion-text-wrap">
              <h2>{topic.name}</h2>
            </IonLabel>
      </IonCard>
    </IonItem>
  );
};

export default TopicItem;

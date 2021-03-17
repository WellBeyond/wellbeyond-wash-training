import React from 'react';
import {Topic} from '../models/Training';
import {IonCard, IonCardContent, IonItem, IonLabel} from '@ionic/react';


interface TopicItemProps {
  topic: Topic;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic}) => {
  return (
    <IonItem button detail={false} lines="none" className="topic-item" routerLink={`/tabs/training?topicId=${topic.id}`}>
      <IonCard className="topic-card">
        <IonCardContent>
            <img src={topic.photo} crossOrigin='anonymous' alt={topic.name} />
        </IonCardContent>
        <IonLabel>
              <h2>{topic.name}</h2>
            </IonLabel>
      </IonCard>
    </IonItem>
  );
};

export default TopicItem;

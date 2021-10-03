import React from 'react';
import {System} from '../models/Maintenance';
import {IonCard, IonCardContent, IonCardHeader, IonLabel} from '@ionic/react';


interface SystemItemProps {
  system: System;
  target?: string;
}

const SystemItem: React.FC<SystemItemProps> = ({ system, target}) => {
  target = target ? ('/'+ target) : '';
  return (
      <IonCard button className="system-card" routerLink={`/tabs/systems/${system.id}${target}`}>
        <IonCardHeader>
            <IonLabel className="ion-text-wrap">
              <h2>{system.name}</h2>
            </IonLabel>
        </IonCardHeader>

        <IonCardContent>
          <div dangerouslySetInnerHTML={{__html: system.description}}></div>
        </IonCardContent>
      </IonCard>
  );
};

export default SystemItem;

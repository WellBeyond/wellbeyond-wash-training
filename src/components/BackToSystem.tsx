import React, {useContext, useEffect, useState} from 'react';
import {System} from '../models/Maintenance';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';


interface BackToSystemProps {
  system: System;
  target?: string;
}

const BackToSystemLink: React.FC<BackToSystemProps> = ({ system, target}) => {
  target = target ? ('/'+ target) : '';

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('/tabs/maintenance');

  useEffect(() => {
    if (system) {
      setBackLink('/tabs/systems/' + system.id + target );
    }
  }, [system, target]);


  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackToSystemLink;

import React, {useContext, useEffect, useState} from 'react';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';
import { FormType } from '../models/Form';


interface BackToFormProps {
  formType?: FormType;
}

const BackToFormLink: React.FC<BackToFormProps> = ({ formType }) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('');

  useEffect(() => {
    if (formType) {
      setBackLink(`/tabs/${formType?.formCategory}`);
    }
  }, [formType]);

  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}} size="small">
      <IonIcon icon={arrowBack}/>
    </IonButton>
  );
};

export default BackToFormLink;
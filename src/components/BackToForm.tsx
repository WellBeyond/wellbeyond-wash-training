import React, {useContext, useEffect, useState} from 'react';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';
import { Form, FormType } from '../models/Form';


interface BackToLessonsProps {
  form?: Form;
  formType?: FormType;
}

const BackToFormLink: React.FC<BackToLessonsProps> = ({ form, formType }) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('/tabs/impact-reports');

  useEffect(() => {
    if (formType) {
      setBackLink(`/tabs/impact-reports/form-types/${formType?.id}`);
    }
  }, [formType]);

  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackToFormLink;
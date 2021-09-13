import React, {useContext, useEffect, useState} from 'react';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';
import { Form, FormType } from '../models/Form';


interface BackToFormProps {
  form?: Form;
  formType?: FormType;
}

const BackToFormLink: React.FC<BackToFormProps> = ({ form, formType }) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('/tabs/impact-reports');

  useEffect(() => {
    if (form) {
      setBackLink(`/tabs/formTypes/${formType?.id}/forms/${form?.id}`);
    }
  }, [form, formType]);

  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackToFormLink;
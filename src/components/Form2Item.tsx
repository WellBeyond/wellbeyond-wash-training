import React from 'react';
import {FormType} from '../models/Form';
import {IonCard, IonCardContent, IonItem, IonLabel} from '@ionic/react';

interface FormItemProps {
  formType: FormType;
}

const FormItem: React.FC<FormItemProps> = ({ formType }) => {
  return (
    <IonItem button detail={false} lines="none" className="Form-item" routerLink={`/tabs/forms/form-types/${formType.id}=${formType.id}`}>
      <IonCard className="subject-card">
        <IonCardContent>
            <img src={formType.photo} crossOrigin='anonymous' alt={formType.name} />
        </IonCardContent>
        <IonLabel>
              <h2>{formType.name}</h2>
            </IonLabel>
      </IonCard>
    </IonItem>
  );
};

export default FormItem;
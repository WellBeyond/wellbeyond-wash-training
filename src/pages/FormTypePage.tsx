import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonText,
  IonIcon,
  IonLoading
} from '@ionic/react';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './Forms.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Organization} from "../models/User";
import { FormType, Form } from '../models/Form';
import {loadFormsData} from "../data/form/form.actions";
import BackToFormLink from '../components/BackToForm';
import { warning } from 'ionicons/icons';

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
  formType?: FormType,
  userId?: string;
  forms: any;
  organization?: Organization;
  community?: string;
  loadFormsData?: typeof loadFormsData;
}

interface DispatchProps { }

interface FormTypePageProps extends OwnProps, StateProps, DispatchProps { }

const FormTypePage: React.FC<FormTypePageProps> = ({ formType, forms, loadFormsData}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [showLoading, setShowLoading] = useState(true);

  setTimeout(() => {
    setShowLoading(false);
  }, 2000);

  useEffect(() => {
    if (formType?.id) {
      loadFormsData && loadFormsData(formType?.id)
    }
  }, [formType, loadFormsData])


  return (
    <IonPage id="form-type-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            <BackToFormLink formType={formType} />
            {formType?.name}
            </IonTitle>
        </IonToolbar>
      </IonHeader>
      {
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Please wait...'}
          duration={5000}
        />
      }
      {
        forms && forms.length > 0 ?
          <IonContent fullscreen={true}>
            {
              forms && forms.map((form: Form) => (
              <IonCard key={form.id}>
                <IonCardHeader>
                  <IonCardTitle>
                    <h2>{form?.name}</h2>
                    <h3><em dangerouslySetInnerHTML={{__html: form?.description}} /></h3>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                  </IonList>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" fill="solid" color="primary" routerLink={`/tabs/formTypes/${formType?.id}/forms/${form.id}/start`}>{t('resources.forms.startSessionCTA')}</IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            ))}
          </IonContent>
        :
        <IonContent id='no-content'>
            <IonIcon className="no-content-text" icon={warning} color="danger"/>
            <IonText className="no-content-text">{t('resources.forms.nonefound')}</IonText>
        </IonContent>
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    formType: selectors.getFormType(state, ownProps),
    forms: selectors.getFormsForOrganization(state),
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  mapDispatchToProps: { loadFormsData },
  component: FormTypePage
});

import React, {useEffect} from 'react';
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
  IonIcon,
  IonText
} from '@ionic/react';
import {Lesson, Subject} from '../models/Training';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './Forms.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {Organization} from "../models/User";
import {TrainingSessions} from "../data/training/training.state";
import { FormType, Form } from '../models/Form';
import {loadFormsData} from "../data/form/form.actions";
import  {warning} from 'ionicons/icons';

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  trainingSessions?: TrainingSessions;
  formType?: FormType,
  userId?: string;
  forms: Form[];
  organization?: Organization;
  community?: string;
  loadFormsData?: typeof loadFormsData;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const FormTypePage: React.FC<SubjectProps> = ({ formType, forms, loadFormsData, userId, organization, community}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    if (formType?.id) {
      loadFormsData && loadFormsData(formType.id)
    }
  }, [formType, loadFormsData])

  return (
    <IonPage id="form-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{formType?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { forms && forms.length > 0 ?
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
        : <IonContent id='no-content'>
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


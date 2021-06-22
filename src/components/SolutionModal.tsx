import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar, IonFooter,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {connect} from "../data/connect";
import * as selectors from "../data/selectors";
import {UserProfile} from "../models/User";
import {updateDiagnosticLog} from '../data/diagnostic/diagnostic.actions';
import PhotoUpload from "./PhotoUpload";
import {saveOutline} from 'ionicons/icons';
import {DiagnosticLog, Solution, Symptom} from "../models/Diagnostic";

interface OwnProps {
  showModal: boolean,
  closeModal(goback?:boolean): void,
  log: DiagnosticLog;
  symptom: Symptom;
  solution: Solution;
}
interface StateProps {
  profile?: UserProfile;
}

interface DispatchProps {
  updateDiagnosticLog: typeof updateDiagnosticLog;
}

interface StepCompleteProps extends OwnProps, StateProps, DispatchProps { }

const SolutionModal: React.FC<StepCompleteProps> = ({showModal, closeModal, log, symptom, solution, updateDiagnosticLog}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() =>{
    setFormValues({status: '', information: '', photo: ''});
    setFormErrors({status: null});
  }, []);

  const handleChange = (field:string, value:string) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    values[field] = value;
    setFormErrors(errors);
    setFormValues(values);
  }

  const validate = ():boolean => {
    let errors = {...formErrors};
    errors.status = formValues.status ? null : 'diagnostic.errors.statusRequired';
    setFormErrors(errors);
    return !Object.values(errors).some(x => (x !== null && x !== ''));
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate() && log) {
      updateDiagnosticLog(log);
      closeModal(true);
    }
  }

  const setPhoto = (url:string) => {
    let values = {...formValues};
    values.photo = url;
    setFormValues(values);
    if(validate() && log) {
      updateDiagnosticLog(log);
    }
  };

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModal(false)}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('diagnostic.modals.solution', {symptom: symptom.name, solution: solution.name})}</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent>
          <IonList>
            <IonListHeader>
              <h3>{t('diagnostic.solution.didItWork')}</h3>
            </IonListHeader>
            <IonRadioGroup value={formValues.status} onIonChange={e => handleChange('status', e.detail.value)}>
              <IonItem>
                <IonLabel>{t('diagnostic.solution.success')}</IonLabel>
                <IonRadio slot="start" value="yes" />
              </IonItem>
              <IonItem>
                <IonLabel>{t('diagnostic.solution.failure')}</IonLabel>
                <IonRadio slot="start" value="no" />
              </IonItem>
              <IonItem>
                <IonLabel>{t('diagnostic.solution.unable')}</IonLabel>
                <IonRadio slot="start" value="unable" />
              </IonItem>
            </IonRadioGroup>

            {formSubmitted && formErrors.status && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.status)}
              </p>
            </IonText>}
          </IonList>

          <IonList lines="none">
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <IonItemDivider>{t('diagnostic.solution.infolabel')}</IonItemDivider>
            <IonItem>
              <IonTextarea // disabled={formValues.status !== 'incomplete' && formValues.status !== 'repairs-needed'}
                value={formValues.information}
                debounce={2000}
                inputmode="text"
                rows={5}
                placeholder={t('diagnostic.solution.infoplaceholder')}
                onIonChange={e => handleChange('information', e.detail.value!)}></IonTextarea>
            </IonItem>
            <IonItem>
              <PhotoUpload setPhotoUrl={setPhoto} photoUrl={formValues.photo} ></PhotoUpload>
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton type="submit" expand="block" color={"primary"} onClick={save}>
              <IonIcon icon={saveOutline} slot={"primary"}/>
              {t('diagnostic.buttons.continue')}
            </IonButton>
          </IonToolbar>
        </IonFooter>
    </IonModal>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    updateDiagnosticLog
  },
  mapStateToProps: (state) => ({
  }),
  component: SolutionModal
})

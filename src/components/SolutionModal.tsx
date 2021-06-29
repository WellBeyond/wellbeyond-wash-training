import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonList,
  IonModal,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {connect} from "../data/connect";
import {UserProfile} from "../models/User";
import PhotoUpload from "./PhotoUpload";
import {saveOutline} from 'ionicons/icons';
import {DiagnosticLog, Solution, Symptom} from "../models/Diagnostic";

interface OwnProps {
  answer: string,
  showModal: boolean,
  closeModal(next?:boolean, information?:string, photo?:string): void,
  log: DiagnosticLog;
  symptom: Symptom;
  solution: Solution;
}
interface StateProps {
  profile?: UserProfile;
}

interface DispatchProps {
}

interface StepCompleteProps extends OwnProps, StateProps, DispatchProps { }

const SolutionModal: React.FC<StepCompleteProps> = ({answer, showModal, closeModal, log, symptom, solution}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() =>{
    setFormValues({information: '', photo: ''});
    setFormErrors({information: null, photo: null});
  }, []);

  const handleChange = (field:string, value?:string) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    errors.photoOrInfo = null;
    values[field] = value;
    setFormErrors(errors);
    setFormValues(values);
  }

  const validate = ():boolean => {
    let errors = {...formErrors};
    /*
    errors.information = formValues.information ? null : 'diagnostic.errors.informationRequired';
    errors.photo = formValues.photo ? null : 'diagnostic.errors.photoRequired';
     */
    errors.photoOrInfo = (formValues.photo || formValues.information) ? null : 'diagnostic.errors.photoOrInfoRequired';
    setFormErrors(errors);
    return !Object.values(errors).some(x => (x !== null && x !== ''));
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate() && log) {
      closeModal(true, formValues.information, formValues.photo);
    }
  }

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={save}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('diagnostic.modals.solution', {symptom: symptom.name, solution: solution.name})}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="none">
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <IonItemDivider>{t('diagnostic.solution.infolabel')}</IonItemDivider>
          <IonItem>
            <IonTextarea // disabled={formValues.status !== 'incomplete' && formValues.status !== 'repairs-needed'}
              value={formValues.information}
              debounce={500}
              inputmode="text"
              autofocus={true}
              rows={5}
              placeholder={t('diagnostic.solution.infoplaceholder')}
              onIonChange={e => handleChange('information', e.detail.value!)}></IonTextarea>

            {formSubmitted && formErrors.information && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.information)}
              </p>
            </IonText>}
          </IonItem>

          <IonItemDivider>{t('diagnostic.solution.photolabel')}</IonItemDivider>
          <IonItem>
            <PhotoUpload setPhotoUrl={(url) => handleChange('photo', url)} photoUrl={formValues.photo} ></PhotoUpload>
            {formSubmitted && formErrors.photo && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.photo)}
              </p>
            </IonText>}
          </IonItem>
        </IonList>
        {formSubmitted && formErrors.photoOrInfo && <IonText color="danger">
          <p className="ion-padding-start">
            {t(formErrors.photoOrInfo)}
          </p>
        </IonText>}
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
  mapStateToProps: (state) => ({
  }),
  component: SolutionModal
})

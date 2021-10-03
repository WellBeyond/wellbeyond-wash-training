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
import {DiagnosticLog} from "../models/Diagnostic";

interface OwnProps {
  showModal: boolean,
  closeModal(information?:string, photo?:string): void,
  log: DiagnosticLog;
}
interface StateProps {
  profile?: UserProfile;
}

interface DispatchProps {
}

interface StepCompleteProps extends OwnProps, StateProps, DispatchProps { }

const ProblemUnresolvedModal: React.FC<StepCompleteProps> = ({showModal, closeModal, log}) => {

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
      closeModal(formValues.information, formValues.photo);
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
          <IonTitle>{t('diagnostic.modals.unresolved')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding-vertical">
          <IonText color={"primary"}>{t('diagnostic.unresolved.explanation')}</IonText>
        </div>
        <IonList lines="none">
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <IonItemDivider>{t('diagnostic.unresolved.infolabel')}</IonItemDivider>
          <IonItem>
            <IonTextarea // disabled={formValues.status !== 'incomplete' && formValues.status !== 'repairs-needed'}
              value={formValues.information}
              debounce={500}
              inputmode="text"
              autofocus={true}
              rows={5}
              placeholder={t('diagnostic.unresolved.infoplaceholder')}
              onIonChange={e => handleChange('information', e.detail.value!)}></IonTextarea>

            {formSubmitted && formErrors.information && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.information)}
              </p>
            </IonText>}
          </IonItem>

          <IonItemDivider>{t('diagnostic.unresolved.photolabel')}</IonItemDivider>
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
  component: ProblemUnresolvedModal
})

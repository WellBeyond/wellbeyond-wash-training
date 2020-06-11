import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {setUserProfile} from "../data/user/user.actions";
import {connect} from "../data/connect";
import {updateProfile} from "../data/user/userApi";
import {ToastProps} from "../pages/Account";

interface OwnProps {
  name?: string,
  showModal: boolean,
  closeModal(): void,
  showToast(props:ToastProps): void
}

interface StateProps {
}

interface DispatchProps {
  setUserProfile: typeof setUserProfile;
}

interface ChangeProfileProps extends OwnProps, StateProps, DispatchProps { }

const ChangeProfileModal: React.FC<ChangeProfileProps> = ({showModal, closeModal, name, showToast, setUserProfile}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({
    profile: '',
    profileRepeat: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [serverError, setServerError] = useState<Error>();

  useEffect(() =>{
    setFormValues({name: name});
    setFormErrors({name: null, organization: null});
    setServerError(undefined);
  }, [showModal, name]);

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
    errors.name = formValues.name ? null : 'registration.errors.nameRequired';
    setFormErrors(errors);
    return !Object.values(errors).some(x => (x !== null && x !== ''));
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      updateProfile({name: formValues.name, organization: formValues.organization}).then(() => {
        setUserProfile({name: formValues.name, organization: formValues.organization});
        showToast({message: t('registration.messages.profileChanged')});
        closeModal();
      })
        .catch((error) => {
          setServerError(error);
        });
    }
  };

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('registration.modals.changeProfile')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={save}>
          <IonList>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.name')}</IonLabel>
              <IonInput name="name" type="text" value={formValues.name} spellCheck={false} autocapitalize="on" autocomplete="on" required={true} onIonChange={e => {
                handleChange('name', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.organization')}</IonLabel>
              <IonInput name="organization" type="text" value={formValues.organization} spellCheck={false} onIonChange={e => {
                handleChange('organization', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.profile && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.profile)}
              </p>
            </IonText>}
          </IonList>

          {formSubmitted && serverError && <IonText color="danger">
            <p className="ion-padding-start">
              {serverError.message}
            </p>
          </IonText>}

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.changeProfile')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>
    </IonModal>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setUserProfile
  },
  component: ChangeProfileModal
})

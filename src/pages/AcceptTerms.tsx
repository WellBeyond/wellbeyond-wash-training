import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {acceptTerms} from "../data/user/user.actions";
import {Redirect} from "react-router-dom";
import TermsOfService from "../components/TermsOfService";

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  acceptedTerms?: boolean;
}

interface DispatchProps {
  acceptTerms: typeof acceptTerms;
}

interface AcceptTermsProps extends OwnProps, StateProps, DispatchProps { }

const AcceptTerms: React.FC<AcceptTermsProps> = ({acceptTerms, acceptedTerms, isLoggedIn, isRegistered}) => {

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(!!acceptedTerms);
    setFormSubmitted(false);
  }, [acceptedTerms])

  const { t } = useTranslation(['translation'], {i18n} );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checked) {
      setFormSubmitted(true);
      acceptTerms();
    }
  };

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }
  if (isLoggedIn && isRegistered === false) {
    return <Redirect to="/register" />
  }
  if (isLoggedIn && acceptedTerms) {
    if (localStorage.getItem('history')) {
      let path = localStorage.getItem('history')
      // if you restart a form before you finish answering the questions, the page should reset
      path = path ? path : '/tabs';
      localStorage.removeItem('history')
      return <Redirect to={path} />
    }
    return <Redirect to="/tabs" />
  }

  return (
    <IonPage id="accept-terms-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('registration.pages.terms')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="terms-card">
          <IonCardContent className="terms-card-content">
            <TermsOfService />
          </IonCardContent>
        </IonCard>
        <form noValidate onSubmit={save}>
          <IonList>
            <IonItem>
              <IonLabel>
                {t('registration.labels.userAcceptsTerms')}
              </IonLabel>
              <IonCheckbox color="primary" checked={checked} slot="start" onIonChange={(e:CustomEvent) => setChecked(e.detail.checked)}>
              </IonCheckbox>
            </IonItem>
          </IonList>

          {formSubmitted && !checked && <IonText color="danger">
            <p className="ion-padding-start">
              {t('registration.errors.userAcceptsTerms')}
            </p>
          </IonText>}

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block" disabled={!checked}>{t('registration.buttons.acceptTerms')}</IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    acceptTerms,
  },
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    isRegistered: state.user.isRegistered,
    acceptedTerms: state.user.acceptedTerms
  }),
  component: AcceptTerms
})

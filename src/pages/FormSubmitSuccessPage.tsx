import React, {useEffect} from 'react';

import {
  IonContent,
  IonToolbar,
  IonButton,
  IonButtons,
  IonFooter,
} from '@ionic/react';

import './Forms.scss';
import './HomePage.scss';
import HeaderLogo from '../components/HeaderLogo';


import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import * as selectors from '../data/selectors';
import {connect} from '../data/connect';
import {FormType, Form} from '../models/Form';
import {NavLink} from "react-router-dom";
// import { Form } from '../models/Form';

interface OwnProps {
  formType?: FormType,
}

interface StateProps {
  form?: Form,
  defaultLanguage?: string
}

interface DispatchProps {
}

type ImpactReportingPage2Props = OwnProps & StateProps & DispatchProps;

const ImpactReportingPage2: React.FC<ImpactReportingPage2Props> = ({ formType, form, defaultLanguage}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  return (
    <>
      <HeaderLogo pageTitle={t('resources.forms.submit_success.title')} />
      <IonContent className="submit-success-content" fullscreen={true}>
        {t('resources.forms.submit_success.body', {title: form?.name})}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <NavLink to={`/tabs/forms`}>
              <IonButton fill="solid" color="primary">
                {t('resources.forms.submit_success.back_to_forms')}
              </IonButton>
            </NavLink>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </>
  );
};


export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    form: selectors.getForm(state, ownProps),
    defaultLanguage: state.user.defaultLanguage
  }),
  component: React.memo(ImpactReportingPage2)
});

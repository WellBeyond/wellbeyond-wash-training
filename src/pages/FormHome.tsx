import React, {useEffect, useRef} from 'react';

import {
  IonContent,
  IonItemGroup,
  IonList,
  IonLoading,
  IonPage,
} from '@ionic/react';

import './Forms.scss';
import './HomePage.scss';
import HeaderLogo from '../components/HeaderLogo';


import {Trans, useTranslation} from "react-i18next";
import i18n from '../i18n';
import * as selectors from '../data/selectors';
import {connect} from '../data/connect';
import {FormType, Form} from '../models/Form';
import FormItem from "../components/Form2Item";
import {Redirect} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {Organization} from "../models/User";
// import { Form } from '../models/Form';

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
  formTypes: FormType[],
  formType?: FormType,
  forms?: Form[],
  organization?: Organization,
  defaultLanguage?: string
}

interface DispatchProps {
}

type ImpactReportingPage2Props = OwnProps & StateProps & DispatchProps;

const ImpactReportingPage2: React.FC<ImpactReportingPage2Props> = ({ formTypes, formType, organization, defaultLanguage}) => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  if (formTypes && formTypes.length === 1) {
    return <Redirect to={`/tabs/formTypes/${formTypes[0].id}`} />
  }

  return (
    <IonPage ref={pageRef} id="form-page">
      <HeaderLogo pageTitle={t('resources.forms.name_plural')} />
      <IonContent fullscreen={true}>
        {organization && formTypes ? (
          <IonList className="form-list ion-no-border">
              {formTypes.map((formType, index: number) => (
                <IonItemGroup key={`formType-${index}`} className="formType-group">
                    <FormItem formType={formType} />
                </IonItemGroup>))
              }
            </IonList>
        )
        :
          <IonLoading
            isOpen={!formTypes}
            message={'Please wait...'}
            duration={5000}
          />
        }
      </IonContent>
    </IonPage>
  );
};


export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    formTypes: selectors.getFormTypes(state),
    formType: selectors.getFormType(state, ownProps),
    organization: selectors.getUserOrganization(state),
    form: selectors.getForms(state),
    defaultLanguage: state.user.defaultLanguage
  }),
  component: React.memo(ImpactReportingPage2)
});

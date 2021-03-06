import React, {useEffect, useRef} from 'react';

import {
  IonContent,
  IonItem,
  IonItemGroup,
  IonPage,
  IonText,
} from '@ionic/react';

import * as selectors from '../data/selectors';
import {Image} from 'cloudinary-react';
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";

import './HomePage.scss';
import HeaderLogo from '../components/HeaderLogo';

import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';

import {RouteComponentProps} from "react-router";
import { Organization } from '../models/User';
import { Form, FormType } from '../models/Form';

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
  defaultLanguage?: string;
  organization?: Organization;
  community?: string;
  formType?: FormType;
  formTypes: FormType[],
  forms?: Form[],
}

interface DispatchProps {
  // getFormType: typeof selectors.getFormType;
  // getForms: typeof selectors.getForms;
  // getForm: typeof selectors.getForm;
}

type ImpactReportingPageProps = OwnProps & StateProps & DispatchProps;

const ImpactReportingPage: React.FC<ImpactReportingPageProps> = ({defaultLanguage, forms, organization, formTypes, formType}) => {

  const pageRef = useRef<HTMLElement>(null);

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  const getSpecificForm = (formTypes: any[], formTypeName: any) => {
    const element = formTypes.find(item => item.name === formTypeName);
    if (element)
      return element.id
    return '#'
  }

  return(
    <IonPage ref={pageRef} id="water-systems-page" >
      <HeaderLogo pageTitle={t('pages.impactReportingPage.pageTitle')} />
      <IonContent fullscreen={true}>
          <IonItemGroup className="page-items" >
            <IonItem routerLink={`/tabs/impactReports/forms/form-types/${getSpecificForm(formTypes, 'Instructions')}`} className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-comm-impact"
                  alt="Instructions logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.impactReportingPage.instructions')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink={`/tabs/impactReports/forms/form-types/${getSpecificForm(formTypes, 'Surveys')}`} className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-maint-checklist"
                  alt="Surveys logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.impactReportingPage.surveys')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink={`/tabs/impactReports/forms/form-types/${getSpecificForm(formTypes, 'Survey Input')}`} className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-maint-checklist"
                  alt="Surveys logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.impactReportingPage.surveyInput')}</IonText>
              </div>
            </IonItem>
          </IonItemGroup>
      </IonContent>
    </IonPage>
  )
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    defaultLanguage: state.user.defaultLanguage,
    formTypes: selectors.getFormTypes(state),
    formType: selectors.getFormType(state, ownProps),
    organization: selectors.getUserOrganization(state),
    form: selectors.getForms(state),
  }),
  component: React.memo(ImpactReportingPage)
});
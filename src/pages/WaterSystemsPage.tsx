import React, {useEffect, useRef} from 'react';

import {
  IonContent,
  IonItem,
  IonItemGroup,
  IonPage,
  IonText,
} from '@ionic/react';

import {Image} from 'cloudinary-react';
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";

import './HomePage.scss';
import HeaderLogo from '../components/HeaderLogo';

import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';

import {RouteComponentProps} from "react-router";
import * as selectors from '../data/selectors';
import { Organization } from '../models/User';
import { FormType, Form } from '../models/Form';

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
}

type WaterSystemsPageProps = OwnProps & StateProps & DispatchProps;

const WaterSystemsPage: React.FC<WaterSystemsPageProps> = ({defaultLanguage, forms, formTypes}) => {

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
      <HeaderLogo pageTitle={t('pages.waterSystemsPage.pageTitle')} />
      <IonContent fullscreen={true}>
          <IonItemGroup className="page-items" >
            <IonItem routerLink={`/tabs/waterSystems/forms/form-types/${getSpecificForm(formTypes, 'Drill Logs')}`} className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-maint-oversight"
                  alt="Maintenance oversight logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.drillLogs')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-system-diag"
                  alt="Water systems logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.diagnostics')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="/tabs/maintenance" className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-maint-checklist"
                  alt="Maintenance checklist logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.maintenanceChecklists')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink={`/tabs/waterSystems/forms/form-types/${getSpecificForm(formTypes, 'Field Reporting')}`} className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-site-observation"
                  alt="Misc reporting logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.fieldReporting')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink={`/tabs/waterSystems/forms/form-types/${getSpecificForm(formTypes, 'Ticket submission')}`} className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-maint-req"
                  alt="Misc reporting logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.submitTicket')}</IonText>
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
  component: React.memo(WaterSystemsPage)
});
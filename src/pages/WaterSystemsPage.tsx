import React, {useEffect, useRef} from 'react';

import {IonContent, IonItem, IonItemGroup, IonPage, IonLoading, IonText,} from '@ionic/react';

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
  formType: FormType;
  form: Form;
  forms: Form[];
}

interface StateProps {
  defaultLanguage?: string;
  organization?: Organization;
  community?: string;
  formType?: FormType;
  formTypes: FormType[],
  forms?: Form,
  form?: Form[]
}

interface DispatchProps {
}

type WaterSystemsPageProps = OwnProps & StateProps & DispatchProps;

const WaterSystemsPage: React.FC<WaterSystemsPageProps> = ({defaultLanguage, forms,form, formType, formTypes}) => {

  const pageRef = useRef<HTMLElement>(null);

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);
  // console.log({forms, formTypes, form, formType})

  const getSpecificForm = (formTypes: any[], formTypeName: any) => {
    const element = formTypes.find(item => item.name.includes(formTypeName));
    if (element)
      return element.id
    return '#'
  }

  return(
    <IonPage ref={pageRef} id="water-systems-page" >
      <HeaderLogo pageTitle={t('pages.waterSystemsPage.pageTitle')} />
      <IonContent fullscreen={true}>
          <IonItemGroup className="page-items" >
          <IonItem routerLink="/tabs/diagnostic" className="page-item" detail={false}>
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
            {
              formTypes ?
              formTypes && formTypes.map((formType) => {
                if (formType.formCategory === 'water-systems'){
                  return (
                    <IonItem key={formType.id} routerLink={`/tabs/waterSystems/forms/form-types/${getSpecificForm(formTypes, formType.name)}`} className="page-item" detail={false}>
                      <div className="photo">
                        <Image
                          cloudName={cloudinaryConfig.cloudName}
                          publicId={formType.photo}
                          alt="Water System Form Type"
                          quality="auto"
                          width="auto"
                          crop="scale" />
                        <IonText className="subsection ion-text-uppercase">{formType.name}</IonText>
                      </div>
                    </IonItem>
                    )
                }
                return ''
              }): <IonLoading
              isOpen={!formTypes}
              message={'Please wait...'}
              duration={5000}
            />
            }
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
    form: selectors.getFormsForOrganization(state),
    forms: selectors.getForm(state, ownProps),
  }),
  component: React.memo(WaterSystemsPage)
});

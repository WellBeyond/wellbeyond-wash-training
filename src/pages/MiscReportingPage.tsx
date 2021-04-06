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

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
  defaultLanguage?: string
}

interface DispatchProps {
}

type MiscReportingPageProps = OwnProps & StateProps & DispatchProps;

const MiscReportingPage: React.FC<MiscReportingPageProps> = ({defaultLanguage}) => {

  const pageRef = useRef<HTMLElement>(null);

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  return(
    <IonPage ref={pageRef} id="water-systems-page" >
      <HeaderLogo pageTitle={t('pages.miscReportingPage.pageTitle')} />
      <IonContent fullscreen={true}>
          <IonItemGroup className="page-items" >
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-comm-impact"
                  alt="School Attendance logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.miscReportingPage.schoolAttendance')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <Image
                  cloudName={cloudinaryConfig.cloudName}
                  publicId="images/home-page/icon-crop-tracking"
                  alt="Crop Yield logo"
                  quality="auto"
                  width="auto"
                  crop="scale" />
                <IonText className="subsection ion-text-uppercase">{t('pages.miscReportingPage.cropYield')}</IonText>
              </div>
            </IonItem>
          </IonItemGroup>
      </IonContent>
    </IonPage>
  )
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    defaultLanguage: state.user.defaultLanguage
  }),
  component: React.memo(MiscReportingPage)
});
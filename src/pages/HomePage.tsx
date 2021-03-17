import React, {useEffect, useRef} from 'react';

import {
  IonContent,
  IonItem,
  IonItemGroup,
  IonPage,
  IonText,
} from '@ionic/react';

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

type HomePageProps = OwnProps & StateProps & DispatchProps;

const HomePage: React.FC<HomePageProps> = ({defaultLanguage}) => {

  const pageRef = useRef<HTMLElement>(null);

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  return(
    <IonPage ref={pageRef} id="home-page" >
      <HeaderLogo pageTitle={t('app.landing')} menuText={t('menu.menuText')}/>
      <IonContent fullscreen={true}>
          <IonItemGroup className="home-page-items" >
            <IonItem routerLink="/tabs/training" className="home-page-item" detail={false}>
              <div className="topics-logo">
                <img src="assets/img/home-page/icon-comm-impact.jpg" alt="Training topics logo" />
                <IonText className="subsection">{t('pages.homePage.trainingTopics')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="/tabs/maintenance" className="home-page-item" detail={false}>
              <div className="water-systems-logo">
                <img src="assets/img/home-page/icon-custom-submissions.jpg" alt="Water systems logo" />
                <IonText className="subsection">{t('pages.homePage.waterSystems')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="/tabs" className="home-page-item" detail={false}>
              <div className="impact-reporting-logo">
                <img src="assets/img/home-page/icon-maint-checklist.jpg" alt="Impact reporting logo" />
                <IonText className="subsection">{t('pages.homePage.impactReporting')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="/tabs" className="home-page-item" detail={false}>
              <div className="misc-reporting-logo">
                <img src="assets/img/home-page/icon-site-observation.jpg" alt="Misc reporting logo" />
                <IonText className="subsection">{t('pages.homePage.miscReporting')}</IonText>
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
  component: React.memo(HomePage)
});
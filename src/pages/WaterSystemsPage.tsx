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

type WaterSystemsPageProps = OwnProps & StateProps & DispatchProps;

const WaterSystemsPage: React.FC<WaterSystemsPageProps> = ({defaultLanguage}) => {

  const pageRef = useRef<HTMLElement>(null);

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  return(
    <IonPage ref={pageRef} id="water-systems-page" >
      <HeaderLogo pageTitle={t('pages.waterSystemsPage.pageTitle')} menuText={t('menu.menuText')}/>
      <IonContent fullscreen={true}>
          <IonItemGroup className="page-items" >
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <img src="assets/img/home-page/icon-maint-oversight.jpg" alt="Maintenance oversight logo" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.drillLogs')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <img src="assets/img/home-page/icon-system-diag.jpg" alt="Water systems logo" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.diagnostics')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="/tabs/maintenance" className="page-item" detail={false}>
              <div className="photo">
                <img src="assets/img/home-page/icon-maint-checklist.jpg" alt="Maintenance checklist logo" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.maintenanceChecklists')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <img src="assets/img/home-page/icon-site-observation.jpg" alt="Misc reporting logo" />
                <IonText className="subsection ion-text-uppercase">{t('pages.waterSystemsPage.fieldReporting')}</IonText>
              </div>
            </IonItem>
            <IonItem routerLink="#" className="page-item" detail={false}>
              <div className="photo">
                <img src="assets/img/home-page/icon-maint-req.jpg" alt="Misc reporting logo" />
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
    defaultLanguage: state.user.defaultLanguage
  }),
  component: React.memo(WaterSystemsPage)
});
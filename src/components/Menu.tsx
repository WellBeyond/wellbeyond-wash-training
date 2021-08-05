import React from 'react';
import {RouteComponentProps, useLocation, withRouter} from 'react-router';

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToggle
} from '@ionic/react';
import {
  bookOutline,
  constructOutline,
  fingerPrint,
  gitNetworkOutline,
  globe,
  homeOutline,
  logIn,
  logOut,
  moonOutline,
  notificationsOutline,
  person,
  informationCircleSharp,
  infiniteOutline,
  receiptOutline,
} from 'ionicons/icons';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import {enableNotifications, setDarkMode} from '../data/user/user.actions';

import './Menu.css'
import {Subject, Topic} from "../models/Training";
import * as selectors from "../data/selectors";

const routes = {
  appPages: [
    { title: 'menu.home', path: '/tabs/home', icon: homeOutline},
    { title: 'menu.training', path: '/tabs/training', icon: bookOutline },
    // { title: 'menu.maintenance', path: '/tabs/maintenance', icon: constructOutline },
    { title: 'menu.waterSystems', path: '/tabs/water-systems', icon: constructOutline },
    { title: "menu.forms", path: '/tabs/forms', icon: receiptOutline},
    { title: "menu.impactReporting", path: '/tabs/impact-reports', icon: informationCircleSharp},
    { title: "menu.miscReporting", path: '/tabs/reports', icon: infiniteOutline}
  ],
  loggedInPages: [
    { title: 'menu.account', path: '/account', icon: person },
    { title: 'menu.logout', path: '/logout', icon: logOut }
  ],
  loggedOutPages: [
    { title: 'menu.login', path: '/login', icon: logIn },
    // { title: 'menu.signup', path: '/signup', icon: personAdd }
  ],
  aboutPages: [
    { title: 'menu.terms', path: '/termsOfUse', icon: globe },
    { title: 'menu.privacy', path: '/privacyPolicy', icon: fingerPrint }
  ]
};

interface Pages {
  title: string,
  path: string,
  src?: string,
  icon: string,
  routerDirection?: string,
  maintenance?: boolean
}
interface StateProps {
  darkMode: boolean;
  notificationsOn: boolean;
  isLoggedIn?: boolean;
  isMaintenanceUser?: boolean;
  menuEnabled: boolean;
  subjects: Subject[];
  topics: Topic[];
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode
  enableNotifications: typeof enableNotifications
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps { }

const Menu: React.FC<MenuProps> = ({ darkMode, notificationsOn, isLoggedIn, isMaintenanceUser, menuEnabled, subjects, topics, setDarkMode, enableNotifications }) => {
  const location = useLocation();
  const { t } = useTranslation(['translation'], {i18n} );

  function renderlistItems(list: Pages[]) {
    return list
      .filter(route =>
      {
        if (route.maintenance && !isMaintenanceUser) return false;
        return !!route.path;
      })
      .map(p => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem detail={false} routerLink={p.path} routerDirection="none" className={location.pathname.startsWith(p.path) ? 'selected' : undefined}>
            <IonIcon slot="start" src={p.src} icon={p.src ? undefined: p.icon} />
            <IonLabel>{t(p.title)}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  /*
  function renderSubjects() {
    return subjects
      .map(subject => (
        <IonMenuToggle key={subject.id} auto-hide="false">
          <IonItem detail={false} routerLink={'/tabs/subjects/'+subject.id} routerDirection="none" className={location.pathname.endsWith(subject.id) ? 'selected' : undefined}>
            <IonIcon slot="start" src={subject.photo}/>
            <IonLabel>{subject.name}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  function renderTopics() {
    return topics
      .map(topic => (
        <IonMenuToggle key={topic.id} auto-hide="false">
          <IonItem detail={false} routerLink={'/tabs/training?topicId='+topic.id} routerDirection="none">
            <IonIcon slot="start" src={topic.photo}/>
            <IonLabel>{topic.name}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }
   */

  return (
    <IonMenu  type="overlay" disabled={!menuEnabled} contentId="main">
      <IonContent forceOverscroll={false}>
        {isLoggedIn && <IonList lines="none">
          {renderlistItems(routes.appPages)}
        </IonList>}
        <IonList lines="none">
          <IonListHeader>{t('menu.account')}</IonListHeader>
          {isLoggedIn ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
          <IonItem>
            <IonIcon slot="start" icon={moonOutline}></IonIcon>
            <IonLabel>{t('menu.darkMode')}</IonLabel>
            <IonToggle checked={darkMode} onClick={() => setDarkMode(!darkMode)} />
          </IonItem>
          <IonItem>
            <IonIcon slot="start" icon={notificationsOutline}></IonIcon>
            <IonLabel>{t('menu.notificationsOn')}</IonLabel>
            <IonToggle checked={notificationsOn} onClick={() => enableNotifications(!notificationsOn)} />
          </IonItem>
        </IonList>

        <IonList lines="none">
        <IonListHeader>{t('menu.about')}</IonListHeader>
        {renderlistItems(routes.aboutPages)}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    isMaintenanceUser: state.user.isMaintenanceUser,
    darkMode: state.user.darkMode,
    notificationsOn: state.user.notificationsOn,
    isLoggedIn: state.user.isLoggedIn,
    menuEnabled: state.data.menuEnabled,
    subjects: selectors.getSubjectsForOrganization(state),
    topics: selectors.getTopicsForOrganization(state)
  }),
  mapDispatchToProps: ({
    setDarkMode,
    enableNotifications,
  }),
  component: withRouter(Menu)
})

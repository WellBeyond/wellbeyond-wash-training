import React, {Suspense, useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {IonApp, IonLoading, IonRouterOutlet, IonSplitPane, isPlatform} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import Intercom from 'react-intercom';

import Menu from './components/Menu';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
/* Firebase */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import {firebaseConfig} from './FIREBASE_CONFIG';

import * as selectors from './data/selectors';
import MainTabs from './pages/MainTabs';
import {connect} from './data/connect';
import {AppContextProvider} from './data/AppContext';
import {
  loadOrganizations,
  loadTrainingSessions,
  loadFormSessions,
  logoutUser,
  setDefaultLanguage,
  watchAuthState
} from './data/user/user.actions';
import {loadTrainingData} from './data/training/training.actions';
import AcceptTerms from './pages/AcceptTerms';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import {useTranslation} from "react-i18next";
import i18n from "./i18n";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import {loadMaintenanceData} from "./data/maintenance/maintenance.actions";
import {loadFormTypesData} from "./data/form/form.actions";
import {loadDiagnosticData} from "./data/diagnostic/diagnostic.actions";

const App: React.FC = () => {
  return (
    <Suspense fallback={
      <IonLoading
        isOpen={true}
      />
    }>
      <AppContextProvider>
        <IonicAppConnected />
      </AppContextProvider>
    </Suspense>
  );
};

interface StateProps {
  darkMode: boolean;
  loading: boolean;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  intercomUser: any;
  userOrganizationId?: string;
}

interface DispatchProps {
  loadMaintenanceData: typeof loadMaintenanceData;
  loadDiagnosticData: typeof loadDiagnosticData;
  loadTrainingData: typeof loadTrainingData;
  loadTrainingSessions: typeof loadTrainingSessions;
  loadOrganizations: typeof loadOrganizations;
  watchAuthState: typeof watchAuthState;
  logoutUser: typeof logoutUser;
  loadFormSessions: typeof loadFormSessions;
  loadFormTypesData: typeof loadFormTypesData;
}

interface IonicAppProps extends StateProps, DispatchProps { }


const IonicApp: React.FC<IonicAppProps> = ({ darkMode, loading, isLoggedIn, isAdmin, intercomUser, userOrganizationId, loadMaintenanceData, loadTrainingData, loadTrainingSessions, loadFormSessions, loadOrganizations, loadFormTypesData, watchAuthState, logoutUser}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.firestore().enablePersistence()
      .then(function() {
        console.log('Offline persistence enabled')
      })
      .catch(function(err) {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
        }
      });
    loadOrganizations();
    watchAuthState();
  }, [loadOrganizations, watchAuthState]);

  useEffect(() => {
    if (isLoggedIn) {
      setDefaultLanguage(i18n.language);
      loadTrainingSessions();
      loadFormSessions();
    }
  }, [isLoggedIn, loadTrainingSessions, loadFormSessions]);

  useEffect(() => {
    if (userOrganizationId) {
      loadTrainingData(userOrganizationId);
      loadFormTypesData(userOrganizationId);
      loadMaintenanceData(userOrganizationId);
      loadDiagnosticData(userOrganizationId);
    }
  }, [userOrganizationId, loadTrainingData, loadMaintenanceData, loadFormTypesData]);

  useEffect(() => {
    if (isAdmin) {
      loadTrainingData('');
      loadMaintenanceData('');
      loadDiagnosticData('');
      loadFormTypesData('')
    }
  }, [isAdmin, loadTrainingData, loadMaintenanceData, loadFormTypesData]);


  // @ts-ignore
  return (
      <IonApp className={`${darkMode ? 'dark-theme' : ''}`}>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main" animated={false}>
              <Switch>
                <Redirect exact path="/" to="/tabs" />
                <Route path="/tabs" component={MainTabs} />
                <Route path="/account" component={Account} />
                <Route path="/terms" component={AcceptTerms} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/termsOfUse" component={Terms} />
                <Route path="/privacyPolicy" component={Privacy} />
                <Route path="/logout" render={() => {
                  i18n.changeLanguage('en');
                  logoutUser();
                  return <Redirect to="/login" />
                }} />
              </Switch>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>

          <IonLoading
            isOpen={loading}
            message={t('menu.pleaseWait')}
          />
        {process.env.NODE_ENV === 'production' && !isPlatform('hybrid') &&
          <div className="app">
            <Intercom appID="ywg09h0a" alignment={'right'} {...intercomUser} />
          </div>
        }
      </IonApp>
  )
}

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: selectors.getDarkMode(state),
    loading: selectors.getLoading(state),
    isLoggedIn: state.user.isLoggedIn,
    isAdmin: state.user.isAdmin,
    intercomUser: selectors.getIntercomUser(state),
    userOrganizationId: selectors.getUserOrganizationId(state),
  }),
  mapDispatchToProps: { loadTrainingSessions, loadMaintenanceData, loadDiagnosticData, loadTrainingData, loadOrganizations, loadFormTypesData, watchAuthState, logoutUser, loadFormSessions},
  component: IonicApp
});

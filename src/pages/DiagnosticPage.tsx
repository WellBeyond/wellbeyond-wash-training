import React, {useEffect, useRef, useState} from 'react';

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonList,
  IonListHeader,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import './DiagnosticPage.scss'

import {Trans, useTranslation} from "react-i18next";
import i18n from '../i18n';
import * as selectors from '../data/selectors';
import {connect} from '../data/connect';
import {System} from '../models/Maintenance';
import SystemItem from "../components/SystemItem";
import {Redirect} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {Organization} from "../models/User";

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
  systems: System[],
  organization?: Organization,
  defaultLanguage?: string
}

interface DispatchProps {
}


type DiagnosticPageProps = OwnProps & StateProps & DispatchProps;

const DiagnosticPage: React.FC<DiagnosticPageProps> = ({ systems, organization, defaultLanguage}) => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );

  const [systemList, setSystemList] = useState<System[]>([]);

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage || 'en');
  }, [defaultLanguage]);

  useEffect(() => {
    if (systems) {
      let list = systems.sort((a: System, b: System) => {
        return a.name < b.name ? -1 : +1;
      });
      setSystemList(list);
    }
  }, [systems]);

  if (systems && systems.length === 1) {
    return <Redirect to={`/tabs/diagnose/${systems[0].id}`} />
  }

  return (
    <IonPage ref={pageRef} id="system-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t('resources.systems.name_plural')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        {organization && systems ?
          (<IonList>
            <IonListHeader>
              <h4>{t('diagnostic.headers.systems')}</h4>
            </IonListHeader>
            {systems.length ? systemList.map((system, index: number) => (
                <IonItemGroup key={`system-${index}`}>
                  <SystemItem system={system} target="symptoms"/>
                </IonItemGroup>))
              :
              <IonItemGroup>
                <IonItem lines="none">
                  <p>
                    <Trans
                      i18nKey="maintenance.messages.noSystems"
                      values={{contactName: organization.contactName, contactEmail: organization.contactEmail}}/>
                  </p>
                </IonItem>
              </IonItemGroup>
            }
          </IonList>)
          :
          <IonLoading
            isOpen={!systems}
            message={'Please wait...'}
            duration={5000}
          />
        }
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    systems: selectors.getSystemsForCommunity(state),
    organization: selectors.getUserOrganization(state),
    defaultLanguage: state.user.defaultLanguage
  }),
  component: React.memo(DiagnosticPage)
});

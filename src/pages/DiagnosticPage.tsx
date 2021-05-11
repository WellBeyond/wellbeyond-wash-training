import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import {Diagnostics, Engine, Rule, Fact} from "wellbeyond-diagnostic-engine";

interface OwnProps extends RouteComponentProps {
}

interface StateProps {
}

interface DispatchProps {
}

interface DiagnosticPageProps extends OwnProps, StateProps, DispatchProps {}

const DiagnosticPage: React.FC<DiagnosticPageProps> = ({  }) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const engine = new Diagnostics().getEngine();
  engine.addRule({
    conditions: {
      any: [{
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 40
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 5
        }]
      }, {
        all: [{
          fact: 'gameDuration',
          operator: 'equal',
          value: 48
        }, {
          fact: 'personalFoulCount',
          operator: 'greaterThanInclusive',
          value: 6
        }]
      }]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
      type: 'fouledOut',
      params: {
        message: 'Player has fouled out!'
      }
    }
  });

  const handleNext = () => {

  }


  return (
    <IonPage id="diagnostic-page">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonTitle>Test Diagnostics</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen={true}>
          <IonCard className='lesson-card'>
            <IonCardHeader>
              <IonCardSubtitle>Subtitle</IonCardSubtitle>
              <IonCardTitle><h2>Title</h2></IonCardTitle>
            </IonCardHeader>
            <IonCardContent className='question-answer'>

              <IonList>
                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.name')}</IonLabel>
                  <IonInput name="name" type="text" value={name} spellCheck={false} autocapitalize="on" autocomplete="on" required={true} onIonChange={e => {
                    setName(e.detail.value!);
                  }}>
                  </IonInput>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" routerLink={prevUrl} routerDirection='back'>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary"  disabled={!showNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};

export default connect({
  mapDispatchToProps: {
  },
  mapStateToProps: (state, ownProps) => ({
  }),
  component: DiagnosticPage
});

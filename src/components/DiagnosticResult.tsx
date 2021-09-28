import React, {Fragment} from 'react';
import {DiagnosticLog} from '../models/Diagnostic';
import {System} from '../models/Maintenance';
import {IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonText} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {checkmark, checkmarkCircleOutline, closeCircleOutline, helpCircleOutline} from "ionicons/icons";


interface DiagnosticResultProps {
  log: DiagnosticLog;
  system: System;
}

const DiagnosticResult: React.FC<DiagnosticResultProps> = ({ log, system}) => {

  const {t} = useTranslation(['translation'], {i18n});

  return (
    <Fragment>
      {log.symptoms &&
        <Fragment>
          <IonListHeader>
            <h3>
              <IonText className="ion-text-uppercase" color="primary">{t('diagnostic.headers.problems')}</IonText>
            </h3>
          </IonListHeader>
          <IonList>
            {log.symptoms.map((s, idx) => (
              <IonItem>
                <IonLabel className="ion-text-wrap">{s.symptom}</IonLabel>
                <IonNote slot={'end'}>
                  {s.resolved &&
                  <IonIcon icon={checkmark} color="success"/>
                  }
                </IonNote>
              </IonItem>
            ))}
          </IonList>
        </Fragment>
      }
      {log.diagnosticResults &&
      <Fragment>
        <IonListHeader>
          {log.diagnosticResults.length ?
            <h3>
              <IonText className="ion-text-uppercase" color="primary">{t('diagnostic.headers.diagnosticResults')}</IonText>
            </h3>
            :
            <h3>
              <IonText className="ion-text-uppercase" color="danger" >{t('diagnostic.headers.noQuestionsAsked')}</IonText>
            </h3>
          }
        </IonListHeader>
        <IonList>
          {log.diagnosticResults.map((s, idx) => (
            <IonItem>
              <IonLabel className="ion-text-wrap">{s.question}</IonLabel>
              <IonNote slot={'end'}>
                <IonText className="ion-text-uppercase" color="primary">{s.answer}</IonText>
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </Fragment>
      }
      {log.solutionResults &&
      <Fragment>
        <IonListHeader>
          {log.solutionResults.length ?
            <h3>
              <IonText className="ion-text-uppercase" color="primary">{t('diagnostic.headers.solutionResults')}</IonText>
            </h3>
            :
            <h3>
              <IonText className="ion-text-uppercase" color="danger">{t('diagnostic.headers.noSolutionsAttempted')}</IonText>
            </h3>
          }
        </IonListHeader>
        <IonList>
          {log.solutionResults.map((s, idx) => (
            <IonItem>
              <IonLabel className="ion-text-wrap">{s.solution}</IonLabel>
              <IonNote slot={'end'}>
                {s.didItWork === 'yes' &&
                <IonIcon icon={checkmarkCircleOutline} color="success"/>
                }
                {s.didItWork === 'no' &&
                <IonIcon icon={closeCircleOutline} color="danger"/>
                }
                {s.didItWork === 'unable' &&
                <IonIcon icon={helpCircleOutline} color="warning"/>
                }
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </Fragment>
      }
    </Fragment>
  );
}
export default DiagnosticResult;

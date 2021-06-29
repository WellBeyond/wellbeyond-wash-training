import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react';
import {System} from '../models/Maintenance';
import {DiagnosticLog} from '../models/Diagnostic';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './DiagnosticPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToSystemLink from "../components/BackToSystem";
import {Diagnostic, DiagnosticEngine, EngineResult, Solution, Symptom} from "wellbeyond-diagnostic-engine";
import SolutionModal from "../components/SolutionModal";
import VideoPlayer from "../components/VideoPlayer";
import {Image} from "cloudinary-react";
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";
import {getPublicId} from "../util/cloudinary";

interface ResolveFunc {
  (answer:string): void;
}

interface NextQuestion {
  symptom?: Symptom;
  diagnostic?: Diagnostic;
  solution?: Solution;
  resolve?: ResolveFunc;
}

interface OwnProps extends RouteComponentProps {
  system: System;
  log: DiagnosticLog;
}

interface StateProps {
  symptoms: Symptom[]
  diagnostics: Diagnostic[];
  solutions: Solution[];
  engine?: DiagnosticEngine
}

interface DispatchProps { }

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const DiagnosticLogPage: React.FC<SystemProps> = ({ system,  log, symptoms, diagnostics, solutions, engine}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [nextQuestion, setNextQuestion] = useState<NextQuestion>();
  const [result, setResult] = useState<EngineResult>();
  const [answer, setAnswer] = useState<string>();
  const [showNext, setShowNext] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const closeModal = (next?:boolean, information?:string, photo?:string) => {
    setShowModal(false);
    if (next) {
      handleNext();
    }
  }

  const openModal = () => {
    setShowModal(true);
  }

  const handleAnswer = (value:(string)) => {
    if (value) {
      setAnswer(value);
      setShowNext(true);
    }
  }

  const handleNext = () => {
    if (nextQuestion && nextQuestion.resolve) {
      nextQuestion.resolve(answer || 'no answer');
      setAnswer(undefined);
      setShowNext(false);
    }
  }


  useEffect(() => {

    const diagnosticCallback = async function (diagnostic:Diagnostic) {
      const promise = new Promise<string>((resolve, _reject) => {
        console.log('Asking question ...', diagnostic);
        const symptom = symptoms && symptoms.find(s => s.id === diagnostic.symptomId);
        const nextQuestion = {
          symptom: symptom,
          diagnostic: diagnostic,
          resolve: resolve
        };
        setNextQuestion(nextQuestion);
      });
      return promise;
    }

    const solutionCallback = async function (solution:Solution) {
      const promise = new Promise<string>((resolve, _reject) => {
        console.log('Checking to see if this worked...', solution);
        const symptom = symptoms && symptoms.find(s => s.id === solution.symptomId);
        const nextQuestion = {
          symptom: symptom,
          solution: solution,
          resolve: resolve
        };
        setNextQuestion(nextQuestion);
        setShowNext(!solution.askDidItWork);
      });
      return promise;
    }

    if (system && engine && log && symptoms && diagnostics && solutions) {
      if (!engine.initialized) {
        engine.initialize(symptoms, solutions, diagnostics, diagnosticCallback, solutionCallback);
        if (log.symptoms && log.symptoms.length) {
          engine.run(log.symptoms, system.systemTypeIds).then((result) => {
            setNextQuestion(undefined);
            setResult(result);
          });
        }
      }
    }
  }, [system, symptoms, engine, log, diagnostics, solutions]);


  // @ts-ignore
  return (
    <IonPage id="step-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSystemLink system={system} target="symptoms"/>
          </IonButtons>
          <IonTitle>{system ? system.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { system && log ?
        <IonContent fullscreen={true}>
          {(result &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle><h2>Diagnostic Engine Complete</h2></IonCardTitle>
              </IonCardHeader>
            </IonCard>
          )}
          {(nextQuestion && nextQuestion.symptom &&
              <IonText color={'danger'} className="ion-text-center ion-text-uppercase"><h2>{nextQuestion.symptom.name}</h2></IonText>
          )}
          {(nextQuestion && nextQuestion.diagnostic &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle><h3>{nextQuestion.diagnostic.name}</h3></IonCardTitle>
              </IonCardHeader>
              <IonCardContent className='question-answer'>
                <IonList>
                  <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
                    <IonItem>
                      <IonLabel>{t('training.labels.yes')}</IonLabel>
                      <IonRadio slot="start" value="yes" />
                    </IonItem>
                    <IonItem>
                      <IonLabel>{t('training.labels.no')}</IonLabel>
                      <IonRadio slot="start" value="no" />
                    </IonItem>
                  </IonRadioGroup>
                </IonList>

                {(nextQuestion.diagnostic.instructions &&
                  <IonItem detail={false} lines="none" className="lesson-item">
                    <div dangerouslySetInnerHTML={{__html: nextQuestion.diagnostic.instructions}}></div>
                  </IonItem>
                )}

                {(nextQuestion.diagnostic.photos &&
                  <IonList>
                    {nextQuestion.diagnostic.photos.length ? nextQuestion.diagnostic.photos.map((photo:any, index: number) => (
                        <IonItem key={`photo-${index}`}>
                          <IonCard className="lesson-card">
                            <IonCardHeader>
                                <IonLabel>
                                  <h4>{photo.title}</h4>
                                </IonLabel>
                            </IonCardHeader>

                            <IonCardContent>
                              <IonItem button detail={false} lines="none" className="lesson-item">
                                <Image
                                  alt={photo.title}
                                  cloudName={cloudinaryConfig.cloudName}
                                  publicId={getPublicId(photo.url)}
                                  quality="auto"
                                  width="auto"
                                  crop="scale"/>
                              </IonItem>
                              <IonItem button detail={false} lines="none" className="lesson-item">
                                <div dangerouslySetInnerHTML={{__html: photo.description}}></div>
                              </IonItem>
                            </IonCardContent>
                          </IonCard>
                        </IonItem>))
                      :
                      undefined
                    }
                  </IonList>
                )}

                {(nextQuestion.diagnostic.videos &&
                  <IonList>
                    {nextQuestion.diagnostic.videos.length ? nextQuestion.diagnostic.videos.map((video:any, index: number) => (
                        <IonItem key={`video-${index}`}>
                          <IonCard className="lesson-card">
                            <IonCardHeader>
                              <IonLabel>
                                <h4>{video.title}</h4>
                              </IonLabel>
                            </IonCardHeader>

                            <IonCardContent>
                              <IonItem detail={false} lines="none" className="lesson-item">
                                {nextQuestion.diagnostic && <VideoPlayer id={`video-${nextQuestion.diagnostic.id}-${index}`} src={video.url}  />}
                              </IonItem>
                              <IonItem button detail={false} lines="none" className="lesson-item">
                                <div dangerouslySetInnerHTML={{__html: video.description}}></div>
                              </IonItem>
                            </IonCardContent>
                          </IonCard>
                        </IonItem>))
                      :
                      undefined
                    }
                  </IonList>
                )}
              </IonCardContent>
            </IonCard>
          )}

          {(nextQuestion && nextQuestion.solution && nextQuestion.symptom &&
            <Fragment>
              <IonCard className='lesson-card'>
                <IonCardHeader>
                  <IonCardTitle><h3>{nextQuestion.solution.name}</h3></IonCardTitle>
                </IonCardHeader>
                <IonCardContent className='solution-description'>

                  {(nextQuestion.solution.instructions &&
                  <IonItem detail={false} lines="none" className="lesson-item">
                    <div dangerouslySetInnerHTML={{__html: nextQuestion.solution.instructions}}></div>
                  </IonItem>
                  )}
                  {(nextQuestion.solution.photos &&
                    <IonList>
                      {nextQuestion.solution.photos.length ? nextQuestion.solution.photos.map((photo:any, index: number) => (
                          <IonItem key={`photo-${index}`}>
                            <IonCard className="lesson-card">
                              <IonCardHeader>
                                <IonLabel>
                                  <h4>{photo.title}</h4>
                                </IonLabel>
                              </IonCardHeader>

                              <IonCardContent>
                                <IonItem detail={false} lines="none" className="lesson-item">
                                  <Image
                                    alt={photo.title}
                                    cloudName={cloudinaryConfig.cloudName}
                                    publicId={getPublicId(photo.url)}
                                    quality="auto"
                                    width="auto"
                                    crop="scale"/>
                                </IonItem>
                                <IonItem detail={false} lines="none" className="lesson-item">
                                  <div dangerouslySetInnerHTML={{__html: photo.description}}></div>
                                </IonItem>
                              </IonCardContent>
                            </IonCard>
                          </IonItem>))
                        :
                        undefined
                      }
                    </IonList>
                  )}

                  {(nextQuestion.solution.videos &&
                    <IonList>
                      {nextQuestion.solution.videos.length ? nextQuestion.solution.videos.map((video:any, index: number) => (
                          <IonItem key={`video-${index}`}>
                            <IonCard className="lesson-card">
                              <IonCardHeader>
                                <IonLabel>
                                  <h4>{video.title}</h4>
                                </IonLabel>
                              </IonCardHeader>

                              <IonCardContent>
                                <IonItem detail={false} lines="none" className="lesson-item">
                                  {nextQuestion.solution && <VideoPlayer id={`video-${nextQuestion.solution.id}-${index}`} src={video.url}  />}
                                </IonItem>
                                <IonItem button detail={false} lines="none" className="lesson-item">
                                  <div dangerouslySetInnerHTML={{__html: video.description}}></div>
                                </IonItem>
                              </IonCardContent>
                            </IonCard>
                          </IonItem>))
                        :
                        undefined
                      }
                    </IonList>
                  )}
                </IonCardContent>
              </IonCard>
              {(nextQuestion.solution.askDidItWork &&
              <IonCard className='lesson-card'>
                <IonCardHeader>
                  <IonCardTitle><h3>Did this fix the problem?</h3></IonCardTitle>
                </IonCardHeader>
                <IonCardContent className='question-answer'>
                  <IonList>
                    <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
                      <IonItem>
                        <IonLabel>Yes, that fixed the problem</IonLabel>
                        <IonRadio slot="start" value="yes" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>No the problem is still there</IonLabel>
                        <IonRadio slot="start" value="no" />
                      </IonItem>
                      <IonItem>
                        <IonLabel>I'm not able to do this</IonLabel>
                        <IonRadio slot="start" value="unable" />
                      </IonItem>
                    </IonRadioGroup>
                  </IonList>
                </IonCardContent>
              </IonCard>
              )}
              <SolutionModal showModal={showModal} closeModal={closeModal} log={log} answer={answer || ''} symptom={nextQuestion.symptom} solution={nextQuestion.solution} />
            </Fragment>
          )}
        </IonContent>
        : undefined
      }
      <IonFooter>
        <IonToolbar>
          {nextQuestion &&
            (nextQuestion.solution && nextQuestion.solution.askForPhotoAfter && answer === 'yes' ?
              <IonButton  expand="block" fill="solid" color="primary" disabled={!showNext} onClick={openModal}>{t('buttons.next')}</IonButton>
              :
              <IonButton  expand="block" fill="solid" color="primary" disabled={!showNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
            )
          }
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystemForDiagnostic(state, ownProps),
    log: selectors.getDiagnosticLog(state, ownProps),
    symptoms: selectors.getSymptoms(state),
    diagnostics: selectors.getDiagnostics(state),
    solutions: selectors.getSolutions(state),
    engine: selectors.getDiagnosticEngine(state)
  }),
  component: DiagnosticLogPage
});


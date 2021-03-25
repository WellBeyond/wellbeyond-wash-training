import React, {Fragment, useEffect} from 'react';
import {IonButton, IonCol, IonGrid, IonIcon, IonProgressBar, IonRow, IonToast,} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";

import useFirebaseUpload from "../hooks/useFirebaseUpload";
import {CameraResultType} from "@capacitor/core";
import {availableFeatures, useCamera} from "@capacitor-community/react-hooks/camera";

import {cameraOutline, closeCircleOutline} from 'ionicons/icons';

import './PhotoUpload.css'

interface PhotoUploadProps {
  photoUrl?: string;
  setPhotoUrl(url?:string): void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({photoUrl, setPhotoUrl}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  // setting up the hook to upload file and track its progress
  const [
    { dataResponse, isLoading, isError, progress },
    setFileData,
    clearError
  ] = useFirebaseUpload();

  const { photo, getPhoto } = useCamera();


  // when the photo state changes, then call setFileData to upload
  // the image using firebase-hook
  useEffect(() => {
    setFileData(photo);
  }, [photo, setFileData]);

  // when the dataResponse changes, set the photo on the form
  useEffect(() => {
    if (dataResponse && dataResponse.downloadUrl && photoUrl !== dataResponse.downloadUrl) {
      setPhotoUrl(dataResponse.downloadUrl);
    }
  }, [dataResponse, photoUrl, setPhotoUrl]);

  const handleTakePhoto = () => {
    if (availableFeatures.getPhoto) {
      getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
    }
  };

  const removePhoto = () => {
    setPhotoUrl('');
  }

  return (
    <Fragment>
      <IonGrid fixed>
        <IonRow>
          <IonCol size="12">
            {/* get loading information from hook and display progress if necessary */}
            {isLoading && progress && (
              <IonProgressBar value={progress.value}></IonProgressBar>
            )}
            {availableFeatures.getPhoto ? null : (
              <input
                type="file"
                onChange={(e: any) => {
                  setFileData(e.target.files[0]);
                }}
              />
            )}
            {photoUrl && (
              <img
                src={photoUrl} alt={""}
              />
            )}
          </IonCol>
        </IonRow>
        {photoUrl ?
          <IonRow>
            <IonCol size="6">
              <IonButton onClick={handleTakePhoto} size={"small"} color={"success"}>
                <IonIcon  icon={cameraOutline} slot={"start"}/>
                {t('maintenance.buttons.updatePhoto')}
              </IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton onClick={removePhoto} size={"small"} color={"danger"}>
                <IonIcon  icon={closeCircleOutline} slot={"start"}/>
                {t('maintenance.buttons.deletePhoto')}
              </IonButton>
            </IonCol>
          </IonRow>
         :
          <IonRow>
            <IonCol size="12">
              <IonButton onClick={handleTakePhoto} size={"small"} color={"success"}>
                <IonIcon  icon={cameraOutline} slot={"start"}/>
                {t('maintenance.buttons.addPhoto')}
              </IonButton>
            </IonCol>
          </IonRow>
        }
      </IonGrid>
      {/* <!-- the toast for errors --> */}
      <IonToast
        isOpen={isError ? true : false}
        onDidDismiss={() => clearError(false)}
        message={isError && isError.message}
        color="danger"
        position="bottom"
        buttons={[
          {
            text: "Done",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          }
        ]}
      />
    </Fragment>
  );
};

export default PhotoUpload;

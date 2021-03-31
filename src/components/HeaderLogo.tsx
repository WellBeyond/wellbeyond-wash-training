import React from 'react';
import { IonCardContent, IonCard, IonText, IonMenuButton, IonHeader } from '@ionic/react';
import {Image} from 'cloudinary-react';
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";

import './HeaderLogo.scss'

// functional component
const HeaderLogo = (properties: any) => {
  return (
    <IonHeader translucent={true} className="page-header ion-no-border" text-center>
      <IonMenuButton />
      <IonCard className="header-logo">
        <IonCardContent>
          <div className="well-beyond-logo">
            <Image
              alt="WellBeyond logo"
              cloudName={cloudinaryConfig.cloudName}
              publicId="images/home-page/appicon"
              quality="auto"
              width="auto"
              crop="scale"/>
            <IonText className="ion-text-uppercase">{ properties.pageTitle }</IonText>
          </div>
        </IonCardContent>
      </IonCard>
  </IonHeader>
  );
}

export default HeaderLogo
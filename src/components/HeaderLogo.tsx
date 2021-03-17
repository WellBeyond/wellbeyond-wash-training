import React from 'react';
import { IonCardContent, IonCard, IonText, IonMenuButton, IonHeader } from '@ionic/react';
import './HeaderLogo.scss'

// functional component
const HeaderLogo = (properties: any) => {
  return (
    <IonHeader translucent={true} className="page-header ion-no-border" text-center>
      <IonMenuButton />
      <IonText className="menu-text ion-hide-lg-up">{properties.menuText}</IonText>
      <IonCard className="header-logo">
        <IonCardContent>
          <div className="well-beyond-logo">
            <img src="assets/img/appicon.png" alt="WellBeyond logo" />
            <IonText className="ion-text-uppercase">{ properties.pageTitle }</IonText>
          </div>
        </IonCardContent>
      </IonCard>
  </IonHeader>
  );
}

export default HeaderLogo
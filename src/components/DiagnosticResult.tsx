import React, {useEffect, useState} from 'react';
import {DiagnosticLog} from '../models/Diagnostic';
import {System} from '../models/Maintenance';
import {IonText} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface DiagnosticResultProps {
  log: DiagnosticLog;
  system: System;
}

const DiagnosticResult: React.FC<DiagnosticResultProps> = ({ log, system}) => {

  const {t} = useTranslation(['translation'], {i18n});

  return (
    <div>
    </div>
  );
}
export default DiagnosticResult;

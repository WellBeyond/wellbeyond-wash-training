import {ActionType} from '../../util/types';
import {createOrUpdateDiagnosticLog, listenForDiagnosticData, listenForDiagnosticLogs} from "./diagnosticApi";
import {DiagnosticLogs, DiagnosticState} from "./diagnostic.state";
import {Symptom, Solution, DiagnosticLog, Diagnostic} from "../../models/Diagnostic";
import {DiagnosticEngine, Almanac} from 'wellbeyond-diagnostic-engine'
import {System} from "../../models/Maintenance";
import React from "react";

const listeners:{symptoms?:any, solutions?:any, diagnostics?: any, diagnosticLogs?:any} = {};

export const loadDiagnosticData = (organizationId:string) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.symptoms && typeof listeners.symptoms === 'function') {
    listeners.symptoms();
  }
  listenForDiagnosticData('symptoms', organizationId, (symptoms: Symptom[]) => {
    dispatch(setSymptoms(symptoms));
  }).then(listener => {
    listeners.symptoms = listener;
  });

  if (listeners.solutions && typeof listeners.solutions === 'function') {
    listeners.solutions();
  }
  listenForDiagnosticData('solutions', organizationId, (solutions: Solution[]) => {
    dispatch(setSolutions(solutions));
  }).then(listener => {
    listeners.solutions = listener;
  });

  if (listeners.diagnostics && typeof listeners.diagnostics === 'function') {
    listeners.diagnostics();
  }
  listenForDiagnosticData('diagnostics', organizationId, (diagnostics: Diagnostic[]) => {
    dispatch(setDiagnostics(diagnostics));
  }).then(listener => {
    listeners.diagnostics = listener;
  });
});

export const loadDiagnosticLogs = (system:System) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.diagnosticLogs && typeof listeners.diagnosticLogs === 'function') {
    listeners.diagnosticLogs();
  }
  listenForDiagnosticLogs(system, (DiagnosticLogs: DiagnosticLogs) => {
    dispatch(setDiagnosticLogs(DiagnosticLogs));
  }).then(listener => {
    listeners.diagnosticLogs = listener;
  });
});

export const updateDiagnosticLog = (log: DiagnosticLog) => async (dispatch: React.Dispatch<any>) => {
  log.archived = !!log.archived;
  log.started = log.started || new Date();
  if (!log.id) {
    log.id = log.systemId + log.started.getTime();
  }
  createOrUpdateDiagnosticLog(log);
  dispatch(setDiagnosticLog(log));
};

export const archiveDiagnosticLog =(log: DiagnosticLog) => async (dispatch: React.Dispatch<any>) => {
  log.archived = true;
  createOrUpdateDiagnosticLog(log);
  dispatch(setDiagnosticLog(log));
  dispatch(setDiagnosticLogArchived(log));
};


export const setData = (data: Partial<DiagnosticState>) => ({
  type: 'set-diagnostic-data',
  data
} as const);

export const setSymptoms = (symptoms: Symptom[]) => ({
  type: 'set-symptoms',
  symptoms
} as const);

export const setSolutions = (solutions: Solution[]) => ({
  type: 'set-solutions',
  solutions
} as const);

export const setDiagnostics = (diagnostics: Diagnostic[]) => ({
  type: 'set-diagnostics',
  diagnostics
} as const);

export const setDiagnosticLog = (log: DiagnosticLog) => ({
  type: 'set-diagnostic-log',
  log
} as const);

export const setDiagnosticLogArchived = (log: DiagnosticLog) => ({
  type: 'set-diagnostic-log-archived',
  log
} as const);

export const setDiagnosticLogs = (logs: DiagnosticLogs) => ({
  type: 'set-diagnostic-logs',
  logs
} as const);

export const setDiagnosticEngine = (engine: DiagnosticEngine) => ({
  type: 'set-diagnostic-engine',
  engine
} as const);

export const setAlmanac = (almanac: Almanac) => ({
  type: 'set-almanac',
  almanac
} as const);


export type DiagnosticActions =
  | ActionType<typeof setData>
  | ActionType<typeof setSymptoms>
  | ActionType<typeof setSolutions>
  | ActionType<typeof setDiagnostics>
  | ActionType<typeof setDiagnosticLogs>
  | ActionType<typeof setDiagnosticLog>
  | ActionType<typeof setDiagnosticLogArchived>
  | ActionType<typeof setDiagnosticEngine>
  | ActionType<typeof setAlmanac>

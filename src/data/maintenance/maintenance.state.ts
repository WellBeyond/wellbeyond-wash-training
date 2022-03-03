import {Checklist, MaintenanceLog, System, SystemType} from '../../models/Maintenance';

export interface MaintenanceState {
  systems: System[];
  checklists: Checklist[];
  systemTypes: SystemType[];
  maintenanceLogs: MaintenanceLogs;
}

export interface MaintenanceLogs {
  [id: string]: MaintenanceLog;
}

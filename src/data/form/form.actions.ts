import {ActionType} from '../../util/types';
import { listenForFormTypeData, listenForFormData } from './formApi'
import { FormState } from './form.state';
import { FormType, Form } from '../../models/Form';

const listeners:{ formTypes?: any, forms?:any} = {};

export const loadFormTypesData = (organizationId:string) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.formTypes && typeof listeners.formTypes === 'function') {
    listeners.formTypes();
  }

  listenForFormTypeData('formTypes', organizationId, (formTypes: FormType[]) => {
    dispatch(setFormTypes(formTypes));
  }).then(listener => {
    listeners.formTypes = listener;
  });
});

export const loadFormsData = (formTypeId: string) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.forms && typeof listeners.forms === 'function') {
    listeners.forms();
  }
  listenForFormData('forms', formTypeId, (forms: Form[]) => {
    dispatch(setForms(forms));
  }).then(listener => {
    listeners.formTypes = listener;
  });
});

export const setData = (data: Partial<FormState>) => ({
  type: 'set-form-data',
  data
} as const);

export const setFormTypes = (formTypes: FormType[]) => {
  return ({
  type: 'set-form-types',
  formTypes: formTypes
} as const)
};

export const setForms = (forms: Form[]) => {
  return ({
  type: 'set-forms',
  forms: forms
} as const)
};

export const setLoading = (isLoading: boolean) => ({
  type: 'set-form-loading',
  isLoading
} as const);

export const setMenuEnabled = (menuEnabled: boolean) => ({
  type: 'set-menu-enabled',
  menuEnabled
} as const);


export type FormActions =
  | ActionType<typeof setData>
  | ActionType<typeof setFormTypes>
  | ActionType<typeof setForms>
  | ActionType<typeof setLoading>
  | ActionType<typeof setMenuEnabled>

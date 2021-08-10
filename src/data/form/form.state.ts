import { FormType, FormSession, Form} from '../../models/Form';

export interface FormState {
  formTypes: FormType[];
  forms: Form[];
  loading?: boolean;
  menuEnabled: boolean;
}

export interface FormSessions {
  [id: string]: FormSession
}

// export type Answer = Record<string, string | number | undefined | null | Array<any | undefined>>;
export type Answer = Record<string, string | number | undefined | null | any[] | Record<string, string | number>>;
export type AnswerExt<T> =  Record<string, string | number | undefined | null | any[] | T>


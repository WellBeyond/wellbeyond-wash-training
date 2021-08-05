import {FormActions} from './form.actions';
import {FormState} from './form.state';

export const formReducer = (state: FormState, action: FormActions): FormState => {
  switch (action.type) {
    case 'set-forms': {
      return {...state, forms: action.forms};
    }
    case 'set-form-types': {
      return {...state, formTypes: action.formTypes};
    }

    case 'set-form-loading': {
      return {...state, loading: action.isLoading};
    }
    case 'set-menu-enabled': {
      return {...state, menuEnabled: action.menuEnabled};
    }
    default:
    return state
  }
}

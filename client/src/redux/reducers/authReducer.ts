import { AuthEvents } from "../../types/authTypes";

export interface AuthState {
  isAuth: boolean;
  user: any;
  loading: boolean;
}

const initState = {
  isAuth: false,
  user: null,
  loading: false,
};

export default (state: AuthState = initState, action: any) => {
  switch (action.type) {
    case AuthEvents.AUTH_INIT:
      return {
        ...state,
        loading: true,
      };
    case AuthEvents.REGISTER_SUCCESS:
      return {
        loading: false,
        isAuth: true,
        user: action.payload,
      };
    case AuthEvents.PROFILE_UPDATE:
      return {
        ...state,
        user: {
          ...state.user,
          color: action.payload.color,
        },
      };
    case AuthEvents.REGISTER_FAIL:
    case AuthEvents.AUTH_FAIL:
    case AuthEvents.LOGOUT:
    case AuthEvents.AUTH_DELETE:
      return {
        isAuth: false,
        user: null,
        loading: false,
      };
    case AuthEvents.AUTH_SUCCESS:
      return {
        isAuth: true,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

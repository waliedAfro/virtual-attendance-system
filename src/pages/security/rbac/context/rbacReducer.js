export const initialState = {
  roles: [],
  permissions: [],
  templates: [],
  userRoleAssignments: [],
  loading: false,
  error: null,
};

const rbacReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROLES":
      return { ...state, roles: action.payload };
    case "ADD_ROLE":
      return { ...state, roles: [...state.roles, action.payload] };
    case "UPDATE_ROLE":
      return {
        ...state,
        roles: state.roles.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
      };
    case "DELETE_ROLE":
      return {
        ...state,
        roles: state.roles.filter((r) => r.id !== action.payload),
      };
    case "SET_PERMISSIONS":
      return { ...state, permissions: action.payload };
    case "SET_TEMPLATES":
      return { ...state, templates: action.payload };
    case "SET_USER_ROLE_ASSIGNMENTS":
      return { ...state, userRoleAssignments: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default rbacReducer;

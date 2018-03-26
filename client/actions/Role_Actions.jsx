
export const GET_ROLE = 'GET_ROLE';
export const UPDATE_ROLE = 'UPDATE_ROLE';

export function updateRole(role) {
  return {
    type: UPDATE_ROLE,
    role,
  };
}

// export function updateRole({ role }) {
//   return {
//     type: UPDATE_ROLE,
//     role,
//   };
// }

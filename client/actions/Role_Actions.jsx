
export const UPDATE_ROLE = 'UPDATE_ROLE';

export function updateRole(role) {
  return {
    type: UPDATE_ROLE,
    role,
  };
}

export const UPDATE_GAME = 'UPDATE_GAME';
export function updateGAME(game) {
  return {
    type: UPDATE_GAME,
    game,
  }

}
// export function updateRole({ role }) {
//   return {
//     type: UPDATE_ROLE,
//     role,
//   };
// }

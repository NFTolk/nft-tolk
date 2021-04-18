import { authenticationService } from '../Services/authenticationService';

function authHeader() {
  const currentUser = authenticationService.currentUserValue;
  console.log(currentUser);
  if (currentUser && currentUser.token) {
    return {
      Authorization: `${currentUser.token}`,
      'Content-Type': 'application/json',
    };
  } else {
    return {};
  }
}

export default authHeader;

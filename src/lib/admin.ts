import {CognitoUserParams, UserObj} from "../types/user";
import {getCognitoUserObj} from "./cognito.js";
import {getUserAttribute, getUserRoles} from "./user.js";
import {getUser, updateUser} from "../sql/user.js";

export const getAdminUserModel = async (adminUser: UserObj, userParams: CognitoUserParams) => {
  try {
    const cognitoUser = await getCognitoUserObj(userParams);
    // let [dbRecord] = await getUser(userParams.Username, true);
    // log.debug({dbRecord});
    const roles = await getUserRoles(userParams);
    const user = {
      id: getUserAttribute(cognitoUser, 'sub'),
      name: getUserAttribute(cognitoUser, 'name'),
      email: getUserAttribute(cognitoUser, 'email'),
      email_verified: getUserAttribute(cognitoUser, 'email_verified'),
      enabled: cognitoUser.Enabled,
      status: cognitoUser.UserStatus,
      roles,
    };
    // if (dbRecord) {
    //   if (
    //     dbRecord.roles !== user.roles
    //     || dbRecord.email !== user.email
    //     || dbRecord.name !== user.name
    //   ) {
    //     [dbRecord] = await updateUser(adminUser, user);
    //   }
    // }
    return {
      ...user,
      cognitoUser,
      // dbRecord
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

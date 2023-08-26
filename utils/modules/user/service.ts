import { HttpException } from '~/utils/models/http-exception.model';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Account } from '~/utils/models/account.model';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { Credentials } from '~/utils/models/credentials.model';
import {
  getIdToken,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { useFirebase } from '~/composables/useFirebase';
import { UpdateProfileImageDto } from './dtos/update-profile-image.dto';
import { ProfileImage } from '~/utils/models/profile-image.model';

const { auth } = useFirebase();

/**
 * Service Implementation for updating user profile image on server.
 * @param updateprofileImageDto DTO Implementation for updating profile image.
 * @returns Updated User Profile Image or Error Details.
 */
export const updateProfileImage = async (
  updateprofileImageDto: UpdateProfileImageDto
): Promise<{
  error: HttpException | null;
  data: ProfileImage | null;
}> => {
  // Generating a Firebase JWT token.
  const firebaseJwt = getIdToken(auth.currentUser!);

  // Send PUT request to update user details on server.
  const { data, error } = await useFetch('/api/v1/user/profile-image', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseJwt}`,
    },
    body: JSON.stringify(updateprofileImageDto.toJson()),
  });

  // Return response data or error details.
  return {
    data: data.value ? ProfileImage.fromJson(data.value) : ProfileImage.empty(),
    error: error.value
      ? HttpException.fromJson(error.value!.data)
      : HttpException.empty(),
  };
};

/**
 * Service Implementation for updating user details on server.
 * @param updateUserDto DTO Implementation for updating user details.
 * @returns Updated User Details or Error Details.
 */
export const updateUser = async (
  updateUserDto: UpdateUserDto
): Promise<{
  error: HttpException | null;
  data: Account | null;
}> => {
  // Generating a Firebase JWT token.
  const firebaseJwt = getIdToken(auth.currentUser!);

  // Send PUT request to update user details on server.
  const { data, error } = await useFetch('/api/v1/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseJwt}`,
    },
    body: JSON.stringify(updateUserDto.toJson()),
  });

  // Return response data or error details.
  return {
    data: data.value ? Account.fromJson(data.value) : Account.empty(),
    error: error.value
      ? HttpException.fromJson(error.value!.data)
      : HttpException.empty(),
  };
};

/**
 * Service Implementation for updating email address on server.
 * @param updateEmailDto DTO Implementation for updating email address.
 * @returns Updated Credentials or Error Details.
 */
export const updateEmailAddress = async (
  updateEmailDto: UpdateEmailDto
): Promise<{
  error: HttpException | null;
  data: Credentials | null;
}> => {
  // Generating a Firebase JWT token.
  const firebaseJwt = getIdToken(auth.currentUser!);

  // Send PUT request to update user details on server.
  const { data, error } = await useFetch('/api/v1/user/email', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseJwt}`,
    },
    body: JSON.stringify(updateEmailDto.toJson()),
  });

  // Return response data or error details.
  return {
    data: data.value ? Credentials.fromJson(data.value) : Credentials.empty(),
    error: error.value
      ? HttpException.fromJson(error.value!.data)
      : HttpException.empty(),
  };
};

/**
 * Service Implementation for updating email address on server and firebase.
 * @param password User Password.
 * @param updateEmailDto DTO Implementation for updating email address.
 * @returns Updated Credentials or Error Details.
 */
export const updateEmailAddressOnFirebase = async (
  password: string,
  updateEmailDto: UpdateEmailDto
): Promise<{
  error: HttpException | null;
  data: Credentials | null;
}> => {
  try {
    // Preparing credentials for reauthentication.
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user!.email!, password);

    // Reauthenticating with firebase.
    await reauthenticateWithCredential(user!, credentials);

    // Updating email address on firebase.
    await updateEmail(user!, updateEmailDto.emailAddress);

    // Updating email address on server.
    return await updateEmailAddress(updateEmailDto);
  } catch (error: any) {
    // Handle Firebase errors.
    let errorString = 'Something went wrong, please try again later';

    if (error.code === 'auth/email-already-in-use') {
      errorString = 'Email provided is already in use.';
    }

    if (error.code === 'auth/user-not-found') {
      errorString = 'This email is not registered to any account.';
    }

    if (error.code === 'auth/wrong-password') {
      errorString = 'You have typed a wrong password, please try again.';
    }

    return {
      data: null,
      error: HttpException.fromJson({
        statusCode: 400,
        message: errorString,
        error: 'Bad Request',
      }),
    };
  }
};

/**
 * Service Implementation for updating password on firebase.
 * @param oldPassword Old Password for the account.
 * @param newPassword New Password for the account.
 * @returns Success or Error Details.
 */
export const updateUserPassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{
  error: HttpException | null;
  data: null;
}> => {
  try {
    // Preparing credentials for reauthentication.
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user!.email!, oldPassword);

    // Reauthenticating with firebase.
    await reauthenticateWithCredential(user!, credentials);

    // Updating email address on firebase.
    await updatePassword(user!, newPassword);

    // Return success
    return {
      data: null,
      error: HttpException.empty(),
    };
  } catch (error: any) {
    // Handle Firebase errors.
    let errorString = 'Something went wrong, please try again later';

    if (error.code === 'auth/weak-password') {
      errorString = 'The new password is a weak password.';
    }

    if (error.code === 'auth/wrong-password') {
      errorString = 'You have typed a wrong password, please try again.';
    }

    return {
      data: null,
      error: HttpException.fromJson({
        statusCode: 400,
        message: errorString,
        error: 'Bad Request',
      }),
    };
  }
};

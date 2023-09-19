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
  deleteUser,
} from 'firebase/auth';
import { useFirebase } from '~/composables/useFirebase';
import { UpdateProfileImageDto } from './dtos/update-profile-image.dto';
import { ProfileImage } from '~/utils/models/profile-image.model';
import { v4 as uuidv4 } from 'uuid';
import { ref as fRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getUser = async (): Promise<{
  error: HttpException | null;
  data: Credentials | null;
}> => {
  // Getting firebase auth instance.
  const { auth } = useFirebase();

  // Generating a Firebase JWT token.
  const firebaseJwt = await getIdToken(auth!.currentUser!);

  // Send GET request to get user details from server.
  const { data, error } = await useFetch('/api/v1/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseJwt}`,
    },
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
 * Upload Profile Images to Firebase and retrieve URLs
 * @param file Image File
 * @returns Updated User Profile Image or Error Details.
 */
export const uploadProfileImage = async (
  file: File | Blob | ArrayBuffer | Uint8Array
): Promise<{
  error: HttpException | null;
  data: ProfileImage | null;
}> => {
  // Generate UUID for the image.
  const uuid = uuidv4();

  // Getting storage reference from firebase composable
  const { storage: firebaseStorage } = useFirebase();

  // Getting object storage reference for upload.
  const profileImageStorage = fRef(
    firebaseStorage,
    `/profile-pictures/${uuid}.jpg`
  );

  // Uploading image.
  await uploadBytes(profileImageStorage, file);

  // Getting URI for the image.
  const publicUrl = await getDownloadURL(profileImageStorage);

  // Saving Image details on the server.
  return await updateProfileImage(
    UpdateProfileImageDto.fromJson({ imageLink: publicUrl, storageUuid: uuid })
  );
};

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
  // Getting firebase auth instance.
  const { auth } = useFirebase();

  // Generating a Firebase JWT token.
  const firebaseJwt = await getIdToken(auth.currentUser!);

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
  // Getting firebase auth instance.
  const { auth } = useFirebase();

  // Generating a Firebase JWT token.
  const firebaseJwt = await getIdToken(auth.currentUser!);

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
  // Getting firebase auth instance.
  const { auth } = useFirebase();

  // Generating a Firebase JWT token.
  const firebaseJwt = await getIdToken(auth.currentUser!);

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
    // Getting firebase auth instance.
    const { auth } = useFirebase();

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
    // Getting firebase auth instance.
    const { auth } = useFirebase();

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

/**
 * Service Implementation for delete user account.
 * @param password User Password.
 * @returns Success or Error Details.
 */
export const deleteAccount = async (
  password: string
): Promise<{
  error: HttpException | null;
  data: null;
}> => {
  try {
    // Getting firebase auth instance.
    const { auth } = useFirebase();

    // Preparing credentials for reauthentication.
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user!.email!, password);

    // Reauthenticating with firebase.
    await reauthenticateWithCredential(user!, credentials);

    // Deleting account on server.
    const { error } = await deleteAccountOnServer();

    // Deleting account on firebase.
    if (error === null) await deleteUser(user!);

    return {
      data: null,
      error: error,
    };
  } catch (error: any) {
    // Handle Firebase errors.
    let errorString = 'Something went wrong, please try again later';

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
 * Service Implementation for deleting user account on server.
 * @returns Success or Error Details.
 */
const deleteAccountOnServer = async (): Promise<{
  error: HttpException | null;
  data: null;
}> => {
  // Getting firebase auth instance.
  const { auth } = useFirebase();

  // Generating a Firebase JWT token.
  const firebaseJwt = await getIdToken(auth.currentUser!);

  // Send DELETE request to delete user account on server.
  const { error } = await useFetch('/api/v1/user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${firebaseJwt}`,
    },
  });

  // Return response data or error details.
  return {
    data: null,
    error: error.value
      ? HttpException.fromJson(error.value!.data)
      : HttpException.empty(),
  };
};

import { Credentials } from '~/utils/models/credentials.model';
import { HttpException } from '~/utils/models/http-exception.model';
import { CreateAccountDto } from '~/utils/modules/auth/dtos/create-account.dto';
import { LoginAccountDto } from './dtos/login-account.dto';
import { useFirebase } from '~/composables/useFirebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const registerNewAccount = async (
  createAccountDto: CreateAccountDto
): Promise<{
  error: HttpException | null;
  data: Credentials | null;
}> => {
  const { data, error } = await useFetch('/api/v1/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createAccountDto.toJson()),
  });

  return {
    data: data.value ? Credentials.fromJson(data.value) : Credentials.empty(),
    error: error.value
      ? HttpException.fromJson(error.value!.data)
      : HttpException.empty(),
  };
};

export const loginAccount = async (
  loginAccountDto: LoginAccountDto
): Promise<{
  error: HttpException | null;
  data: null;
}> => {
  try {
    const { auth } = useFirebase();

    await signInWithEmailAndPassword(
      auth,
      loginAccountDto.emailAddress,
      loginAccountDto.password
    );

    return {
      data: null,
      error: HttpException.empty(),
    };
  } catch (error: any) {
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

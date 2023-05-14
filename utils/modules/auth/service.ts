import { Credentials } from '~/utils/models/credentials.model';
import { HttpException } from '~/utils/models/http-exception.model';
import { CreateAccountDto } from '~/utils/modules/auth/dtos/create-account.dto';

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


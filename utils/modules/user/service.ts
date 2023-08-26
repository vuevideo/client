import { HttpException } from '~/utils/models/http-exception.model';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Account } from '~/utils/models/account.model';

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
  // Send PUT request to update user details on server.
  const { data, error } = await useFetch('/api/v1/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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


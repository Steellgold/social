import { SafeActionResult } from "next-safe-action";
import { z } from "zod";

/**
 * Determines if a server action is successful or not
 * A server action is successful if it has a data property and no serverError property
 *
 * @param action Return value of a server action
 * @returns A boolean indicating if the action is successful
 */
export const isActionSuccessful = <T extends z.ZodType>(
  action?: SafeActionResult<string, T, readonly [], any, any>
): action is { data: T; serverError: undefined; validationError: undefined } => {
  if (!action) {
    return false;
  }

  if (action.serverError) {
    return false;
  }

  if (action.validationErrors) {
    return false;
  }

  return true;
};

/**
 * Conver an action result to a promise that resolves to false
 *
 * @param action Return value of a server action
 * @returns A promise that resolves to false
 */
export const resolveActionResult = async <T extends z.ZodType>(
  action: Promise<SafeActionResult<string, T, readonly [], any, any> | undefined>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    action
      .then((result) => {
        if (isActionSuccessful(result)) {
          resolve(result.data);
        } else {
          reject(result?.serverError ?? 'Something went wrong');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
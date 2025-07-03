type Success<T> = {
  result: T;
  error?: never;
};

type Failure<E> = {
  result?: never;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { result: data };
  } catch (error) {
    return { error: error as E };
  }
}

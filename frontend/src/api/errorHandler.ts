import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Ресурс не найден") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ServerError extends ApiError {
  constructor(message = "Внутренняя ошибка сервера") {
    super(message, 500);
    this.name = "ServerError";
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const isNotFoundError = (error: unknown): error is NotFoundError => {
  return error instanceof NotFoundError;
};

export const isServerError = (error: unknown): error is ServerError => {
  return error instanceof ServerError;
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export const handleAxiosError = (
  error: unknown,
  defaultMessage = "Сетевая ошибка или сервер недоступен",
): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 404) {
      throw new NotFoundError();
    }

    if (status === 500) {
      throw new ServerError();
    }

    throw new ApiError(error.message || defaultMessage, status);
  }

  throw new ApiError(defaultMessage);
};

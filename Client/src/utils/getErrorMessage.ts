import axios from "axios";

export function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? "Can't reach the server. Check your connection";
  }
  return "Something went wrong";
}
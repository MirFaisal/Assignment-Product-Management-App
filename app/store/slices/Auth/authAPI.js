import apiService from "@/app/services/api";

export const Authenticate = async (email) => {
  const response = await apiService.post("/auth", { email });
  return { ...response, email };
};

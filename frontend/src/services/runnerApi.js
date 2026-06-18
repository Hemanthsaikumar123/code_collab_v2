import api from "./api";

export const runCode = async (language,code) => {
  const response = await api.post( "/api/run",
      {
        language,
        code
      }
    );

  return response.data;
};
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const validar_arquivo = async (dados) => {
  let url = `/controle`;
  try {
    const response = await api.post(url, {
      dados,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const conferir_dataBase = async (dados) => {
  let url = `/controle/database`;
  try {
    const response = await api.post(url, {
      dados,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const conferir_regras = async (dados) => {
  let url = `/controle/database/regras`;
  try {
    const response = await api.post(url, {
      dados,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const conferir_itens = async (dados) => {
  let url = `/controle/database/regras/itens`;
  try {
    const response = await api.post(url, {
      dados,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
export const atualizar_itens = async (dados) => {
  let url = `/atualizar/itens`;
  try {
    const response = await api.post(url, {
      dados,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

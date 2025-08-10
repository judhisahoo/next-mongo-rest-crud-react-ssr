// src/lib/api/api.ts
import axiosInstance from './axios';
import { CreateCrudproductDto, UpdateCrudproductDto } from '@/types'; // You'll need to define these types
import { LoginDto } from '@/types'; // You'll need to define this type

// --- Auth APIs ---
export const login = async (credentials: LoginDto) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  console.log('response at login() in auth api at next js', response);
  return response.data;
};

export const register = async (userData: unknown) => {
  console.log('now calling nest js api');
  const response = await axiosInstance.post('/auth/register', userData);
  console.log('api response', response);
  return response.data;
};

// --- Product APIs ---
export const getAllProducts = async (page: number, limit: number) => {
  const response = await axiosInstance.get(
    `/crudproducts?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const getProductDetails = async (id: string) => {
  const response = await axiosInstance.get(`/crudproducts/${id}`);
  return response.data;
};

export const addProduct = async (productData: CreateCrudproductDto) => {
  // `axiosInstance` will automatically add the JWT token to the header
  const response = await axiosInstance.post('/crudproducts', productData);
  return response.data;
};

export const editProduct = async (
  id: string,
  productData: UpdateCrudproductDto,
) => {
  const response = await axiosInstance.patch(
    `/crudproducts/${id}`,
    productData,
  );
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/crudproducts/${id}`);
  return response.data;
};

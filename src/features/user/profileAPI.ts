import axios from "axios";
import { store } from '../../store/store'

export const getUploadUrl = async(fileName:string,fileType:string) => {
  const token = store.getState().auth.user.token;
  const res = await axios.post(
    'http://localhost:5000/api/profile/', 
    { fileName, fileType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
}

export const uploadToS3 = async(file: File, presignedUrl: string) => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }
    console.log('File uploaded successfully');
    return response.ok;
  } catch (error) {
    console.error('Upload error:', error);
  }
}

export const updateProfile = async(key:string, username:string) => {
  const token = store.getState().auth.user.token;
  const res = await axios.put(
    'http://localhost:5000/api/profile/success', 
    { key, username },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(res.data);
  return res.data;
}

export const getCookies = async() => {
  const token = store.getState().auth.user.token;
  const res = await axios.get(
    'http://localhost:5000/api/auth/cookie', 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    }
  );
  console.log(res.data);
  return res.data;
}
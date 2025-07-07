import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { updateProfile, getUploadUrl, uploadToS3 } from "../../services/profileAPI";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toast } from 'react-toastify';
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const [username, setUsername] = useState(user?.username||"");
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      console.warn("No file selected");
    }
  };
  

  const handleSave = async (username:string) => {
    try{
      if (avatarFile) {
        const fileName = avatarFile.name;
        const fileType = avatarFile.type;
        const { uploadUrl, key } = await getUploadUrl(fileName,fileType);
        console.log(uploadUrl);
        const res = await uploadToS3(avatarFile, uploadUrl);
        if(res){
          await updateProfile(key, username);
          toast.success("update avatar success");
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);

        }else{
          toast.error('Upload failed');
        }
      }
    }catch(err){
      console.log('update profile failed:', err);
    }

  };

  return (
    <div>
      <Layout />
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>

        <Stack spacing={2} alignItems="center">
          <Avatar
            src={avatarPreview || "/default-avatar.png"}
            sx={{ width: 100, height: 100 }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
          >
            Upload Avatar
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </Button>

          <TextField
            label="Username"
            value={user.username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <Button variant="contained" onClick={()=>{ handleSave(username) }}>
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Container>
    </div>
  );
}

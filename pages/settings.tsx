import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../src/components/Button';
import { InnerPage, Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../src/context/authenticaton';
import { useFetchFileUpload } from '../src/hooks/useFetch';
import { Colors } from '../src/styles/colors';

const StyledSettingsWrapper = styled(InnerPage)`
  flex-flow: column;
`;

const StyledProfileImage = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 32px;
  img {
    height: 100%;
  }
`;

const StyledProfileImageWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const Settings = () => {
  const fileUpload = useRef(('' as unknown) as HTMLInputElement);
  const [selectedFile, setSelectedFile] = useState('');
  const [userProfile, setUserProfile] = useState<any>({});
  const { user } = useAuth();

  const updateProfilePicture = e => {
    e.preventDefault();
    const obj = {
      firstName: user.firstName,
      profilePicture: userProfile.profilePicture,
    };

    const formData = new FormData();
    formData.append('file', fileUpload.current.files[0]);
    formData.append('userData', JSON.stringify(obj));
    useFetchFileUpload('updateUser', formData).then(resp => {
      setSelectedFile('');
      setUserProfile({ ...userProfile, profilePicture: resp.profilePicture });
    });
  };

  useEffect(() => {
    setUserProfile({ profilePicture: user.profilePicture, id: user.id });
  }, [user]);
  return (
    <Layout>
      <StyledSettingsWrapper>
        <h1>Settings</h1>
        <h2>Change Profile Picture</h2>
        <StyledProfileImageWrapper>
          {userProfile.profilePicture && (
            <StyledProfileImage>
              <img
                src={
                  process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL +
                  'images/fe/ProfilePictures/' +
                  userProfile.id +
                  '/' +
                  userProfile.profilePicture
                }
              />
            </StyledProfileImage>
          )}
          {!selectedFile && (
            <div>
              <Button onClick={() => fileUpload.current.click()}>
                Choose File
              </Button>
            </div>
          )}
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={e => updateProfilePicture(e)}
          >
            <input
              style={{ display: 'none' }}
              ref={fileUpload}
              type="file"
              name="file"
              onChange={e => setSelectedFile(e.target.value)}
            />
            {selectedFile && (
              <>
                <Button>Upload</Button>{' '}
                <Button onClick={() => setSelectedFile('')}>Reset</Button>
              </>
            )}
          </form>
        </StyledProfileImageWrapper>
      </StyledSettingsWrapper>
    </Layout>
  );
};

export default ProtectedRoute(Settings);

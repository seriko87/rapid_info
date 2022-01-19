import React, { useState, useRef, useEffect } from 'react';
import {
  useAuthState,
  uploadPhoto,
  updateUserEmail,
  updateUserProfile,
  updadateUserPassword,
} from '../../firebase';
import './updateProfile.css';
import {
  passValidation,
  passText,
  emailValidation,
} from '../register/Validation';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PasswordContainer from '../register/PasswordText';
import { useNavigate } from 'react-router-dom';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

const UpdateProfile = () => {
  const { currentUser } = useAuthState();
  const passRef = useRef();
  const [newPhoto, setNewPhoto] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/240px-Missing_avatar.svg.png'
  );

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passCorrect, setPassCorrect] = useState(false);
  const [passVisStatus, setPassVisStatus] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const [emailCorrect, setIsEmailCorrect] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [tempPhoto, setTempPhoto] = useState();
  const [nameSave, setNameSave] = useState(false);
  const [emailSave, setEmailSave] = useState(false);
  const [passSave, setPassSave] = useState(false);
  const [photoSave, setPhotoSave] = useState(false);

  const navigate = useNavigate();

  //email validation
  useEffect(() => {
    if (emailValidation(email)) {
      setIsEmailCorrect(true);
    } else {
      setIsEmailCorrect(false);
    }
    const oldEmail = currentUser?.email;
    if (email !== oldEmail) {
      setEmailSave(true);
    } else {
      setEmailSave(false);
    }
  }, [email]);

  useEffect(() => {
    const name = currentUser?.displayName;
    if (userName !== name) {
      setNameSave(true);
    } else {
      setNameSave(false);
    }
  }, [userName]);

  // password Validation
  useEffect(() => {
    if (passValidation(password)) {
      setPassCorrect(true);
    } else {
      setPassCorrect(false);
    }

    if (password) {
      setPassSave(true);
    } else {
      setPassSave(false);
    }
  }, [password]);

  useEffect(() => {
    if (
      document.hasFocus() &&
      passRef.current.contains(document.activeElement)
    ) {
      setFocus(true);
    }
  }, []);

  const handleVisPass = () => {
    setPassVisStatus(!passVisStatus);
  };

  // update functions
  useEffect(() => {
    if (currentUser?.photoURL) {
      setNewPhoto(currentUser.photoURL);
    }
    setUserName(currentUser?.displayName || '');
    setEmail(currentUser?.email || '');
  }, [currentUser]);

  const handleNameChange = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (userName !== currentUser.displayName) {
      updateUserProfile(currentUser, userName)
        .then(() => {
          setMessage('Profile name updated');
          setNameSave(false);
        })
        .catch((error) => {
          setError('Failed to update Name');
        });

      console.log('Name updated', [userName, currentUser.displayName]);
    }
  };

  const handlePhotoChange = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (photo) {
      uploadPhoto(photo, currentUser, setNewPhoto)
        .then(() => {
          setPhotoSave(false);
        })
        .catch((error) => {
          setError('Failed to update photo, try different image');
          setPhotoSave(false);
        });
    }
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (email !== currentUser.email) {
      if (emailCorrect) {
        updateUserEmail(email)
          .then(() => {
            setMessage('Profile email updated');
            setEmailSave(false);
          })
          .catch((error) => {
            setError('Failed to update email, try log in again');
          });
      } else {
        setError('Plase enter valid email address');
      }
    }
  };

  const handlePassChange = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== '') {
      if (passCorrect) {
        updadateUserPassword(password)
          .then(() => {
            setMessage('Profile password updated');
            setPassword('');
          })
          .catch(() => {
            setError('Failed to update password, try log in again');
          });
      } else {
        setError('Please Enter Valid Password');
      }
    }
  };

  function handleCancel() {
    navigate('/', { replace: true });
  }

  const handleChangeFile = (e) => {
    setPhoto(e.target.files[0]);
    setTempPhoto(URL.createObjectURL(e.target.files[0]));
    setPhotoSave(true);
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      setError('');
      setMessage('');
    }, 10000);
    return () => {
      clearTimeout(interval);
    };
  }, [error, message]);

  return (
    <div className="updateProfileContainer">
      <div className="updateContainer">
        <div className="updateProfileTitle">Edit Profile</div>
        <div className="updateProfPic">
          <label class="updatePicIcon">
            <input
              type="file"
              accept=".jpg,.jpeg,.png, .webp"
              className="custom-file-icon"
              onChange={handleChangeFile}
            />
            <PhotoCameraOutlinedIcon className="photoAddIcon" />
          </label>
          {photoSave && (
            <button
              className="saveBtnUpdatePic"
              onClick={handlePhotoChange}
              style={
                !photoSave ? { bottom: -26 + 'px' } : { bottom: -2 + 'px' }
              }
            >
              Save
            </button>
          )}
          <img
            src={tempPhoto ? tempPhoto : newPhoto}
            alt="Profile"
            className="updateProfilePic"
          />
        </div>
      </div>

      <form className="updateProfileWrap">
        <div className="inputWrapProfile">
          <label htmlFor="name" className="updateLabel">
            Name:{' '}
          </label>

          <input
            className="updateProfileInput"
            name="name"
            type="text"
            id="name"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            style={!nameSave ? { width: 317.5 + 'px' } : { width: 250 + 'px' }}
          />
          {nameSave && (
            <button className="saveBtnUpdate" onClick={handleNameChange}>
              Save
            </button>
          )}
        </div>
        <div className="inputWrapProfile">
          <label htmlFor="email" className="updateLabel">
            E-mail:{' '}
          </label>
          <input
            className="updateProfileInput"
            name="email"
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            style={!emailSave ? { width: 317.5 + 'px' } : { width: 250 + 'px' }}
            value={email}
          />
          {emailSave && (
            <button className="saveBtnUpdate" onClick={handleEmailChange}>
              Save
            </button>
          )}
        </div>

        <div className="inputWrapProfile">
          <label htmlFor="password" className="updateLabel">
            Password:{' '}
          </label>
          <input
            placeholder="*******"
            className="updateProfileInput"
            name="password"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => setPassword(e.target.value)}
            type={passVisStatus ? 'text' : 'password'}
            ref={passRef}
            value={password}
            style={!passSave ? { width: 317.5 + 'px' } : { width: 250 + 'px' }}
          />
          {passSave &&
            (!passVisStatus ? (
              <VisibilityIcon
                className="passVisIcon"
                onClick={() => handleVisPass()}
              />
            ) : (
              <VisibilityOffIcon
                className="passVisIcon"
                onClick={() => handleVisPass()}
              />
            ))}
          {hasFocus ? (
            <div className="passUpdateInfo">
              <div className="triangle"></div>
              {passText.map((item, index) => {
                return (
                  <PasswordContainer pass={password} item={item} key={index} />
                );
              })}
            </div>
          ) : null}
          {passSave && (
            <button className="saveBtnUpdate" onClick={handlePassChange}>
              Save
            </button>
          )}
        </div>
        {error && <div className="profileUpdateError">{error}</div>}
        {message && <div className="profileSuccesMessage">{message}</div>}
      </form>
      <div className="updateBtnWrap">
        <button className="cancelProfileBtn" onClick={handleCancel}>
          Go back
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;

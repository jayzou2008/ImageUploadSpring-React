import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useDropzone } from 'react-dropzone'


const UserProfiles = () => {

  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfile = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then(res => {
      console.log(res);
      setUserProfiles(res.data);
    });
  };

  // fetchUserProfile();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return userProfiles.map((userProfile, index) => {
    return (
      <div key={index}>
        <br />
        <br />
        <h1>{userProfile.username}</h1>
        <p>{userProfile.userProfileId}</p>
        <Dropzone {...userProfile} />
      </div>
    )
  })
}

function Dropzone({ userProfileId }) {
  const onDrop = useCallback(acceptedFiles => {
    // Do some action to the draged file
    const file = acceptedFiles[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    console.log("profile id is " + userProfileId);
    const path = "http://localhost:8080/api/v1/user-profile/" + userProfileId + "/image/upload";

    console.log("post path is " + path);
    axios
    .post(
      path, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )
    .then(() => {
      console.log("file uploaded successfully")
    })
    .catch(err => {
      console.log("axios upload errors");
      console.log(err);
      console.log(err.request);
    });

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <UserProfiles />
    </div>
  );
}

export default App;


    // acceptedFiles.forEach((file) => {
    //   const reader = new FileReader()

    //   reader.onabort = () => console.log('file reading was aborted')
    //   reader.onerror = () => console.log('file reading has failed')
    //   reader.onload = () => {
    //     // Do whatever you want with the file contents

    //     console.log("Here is the file content");
    //     console.log(reader.result)
    //   }
    //   // reader.readAsArrayBuffer(file)
    //   reader.readAsText(file);
    // })
import { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { Button, Center, Select, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

function ClaimUserName() {
  const [userNames, setUserNames] = useState([]);
  const authId = sessionStorage.getItem('access_token');

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/users/userNames", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setUserNames(await response.json())
    });


  }, [authId])

  return <Demo userNames={userNames} authId={authId}></Demo>
}

export default ClaimUserName;

function Demo({ userNames, authId }) {

  const [currentUserName, setcurrentUserName] = useState("");
  const [oldUserName, setoldUserName] = useState("");
  const [newUserName, setnewUserName] = useState("");

  const claimUserNameAPI = async () => {
    const data = {
      currentUserName,
      oldUserName,
      newUserName,
    }
    fetch(import.meta.env.VITE_API + "/users/claim", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        showNotification({
          variant: 'outline',
          color: 'green',
          title: 'Success'
        })
      }
      throw new Error(response)
      // TODO: Error response
    }).catch((error) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: 'Please check the values and try again'
      })
    });

  };

  return (
    <Center>
      <Stack>
        <Select label="Current Username"
          data={userNames}
          value={currentUserName}
          onChange={setcurrentUserName}
          searchable
        ></Select>
        <Select label="old Username"
          data={userNames}
          value={oldUserName}
          onChange={setoldUserName}
          searchable
        ></Select>
        <Select label="Username henceforth"
          data={userNames}
          value={newUserName}
          onChange={setnewUserName}
          searchable
        ></Select>
        {/* TODO: Give an option for user to select what they want their new username as */}
        <Button onClick={claimUserNameAPI}>Claim username!</Button>
      </Stack>
    </Center>
  )
}


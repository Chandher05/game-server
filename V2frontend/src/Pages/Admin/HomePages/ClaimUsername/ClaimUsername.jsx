import { useState, useEffect, useCallback } from 'react';
import { Button, Center, Select, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getIdTokenOfUser } from '../../../../Providers/Firebase/config';

function ClaimUserName() {
  const [userNames, setUserNames] = useState([]);

  const getUserNames = useCallback(
    async () => {
      const authId = await getIdTokenOfUser();
      fetch(import.meta.env.VITE_API + "/users/userNames", {
        headers: {
          Authorization: `Bearer ${authId}`,
        },
      }).then(async (response) => {
        if (response.ok) setUserNames(await response.json())
        else {
          throw await response.json()
        }
      }).catch((error) => {
        showNotification({
          variant: 'outline',
          color: 'red',
          title: 'Something went wrong!',
          message: error.msg
        })
      })
    }, []
  )


  useEffect(() => {
    getUserNames();
  }, [])

  return <Demo userNames={userNames} ></Demo>
}

export default ClaimUserName;

function Demo({ userNames }) {

  const [currentUserName, setcurrentUserName] = useState("");
  const [oldUserName, setoldUserName] = useState("");
  const [newUserName, setnewUserName] = useState("");

  const claimUserNameAPI = async () => {
    const data = {
      currentUserName,
      oldUserName,
      newUserName,
    };
    const authId = await getIdTokenOfUser();
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
      } else {
        throw await response.json()
      }
    }).catch((error) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: error.msg
      })
    })

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


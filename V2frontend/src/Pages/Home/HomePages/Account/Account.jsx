
import { useState, useEffect, useCallback } from 'react';
import { Button, Select, Modal, SegmentedControl, Center, Stack, Text, Group, ActionIcon, Textarea } from "@mantine/core";
import { IconPencil } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { StatsControls } from './Stats'
import { getIdTokenOfUser } from '../../../../Providers/Firebase/config'

function Account() {
  const [profileData, setProfileData] = useState([]);
  const [playerUserName, setProfileUserName] = useState("");
  const [editDisabled, setEditDisabled] = useState(true);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserNameToUpdate, setSelectedUserNameToUpdate] = useState("");



  const getAccountDetails = useCallback(
    async () => {
      const authId = await getIdTokenOfUser();
      fetch(import.meta.env.VITE_API + "/users/profile", {
        headers: {
          Authorization: `Bearer ${authId}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          response.json().then(json => {
            setProfileData(json)
            setProfileUserName(json.userName)
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
      fetch(import.meta.env.VITE_API + "/users/userNames", {
        headers: {
          Authorization: `Bearer ${authId}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          response.json().then(json => {
            setUserNames(json)
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
    },
    [],
  );



  useEffect(() => {
    getAccountDetails();
  }, [getAccountDetails])

  return (
    // Can we add send message also in this page?
    <div>
      <Stats profileData={profileData} playerUserName={playerUserName} setProfileUserName={setProfileUserName} editDisabled={editDisabled} setEditDisabled={setEditDisabled} />

      <ClaimUserName userNames={userNames} profileData={profileData} selectedUserNameToUpdate={selectedUserNameToUpdate} setSelectedUserNameToUpdate={setSelectedUserNameToUpdate} />
    </div>
  )
}

export default Account;

function Stats({ profileData, playerUserName, setProfileUserName, editDisabled, setEditDisabled }) {


  const changeUserName = (e) => {
    let newUserName = e.target.value.replace(/\W/g, '')
    setProfileUserName(newUserName.toLowerCase())
  }

  const toggleEdit = (e) => {
    setEditDisabled(!editDisabled)
  }

  const saveUserName = async () => {
    const data = {
      newUserName: playerUserName
    }
    const authId = await getIdTokenOfUser();
    fetch(import.meta.env.VITE_API + "/users/update", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) setEditDisabled(!editDisabled)
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
  }

  // TODO: Edit and update username
  return (
    <Center style={{ padding: '20px' }}>
      <Stack spacing={'xs'}>

        <Group>
          <Text>Username: <input type="text" value={playerUserName} onChange={changeUserName} disabled={editDisabled} /></Text>
          {
            editDisabled ?
              <ActionIcon onClick={toggleEdit}>
                <IconPencil />
              </ActionIcon> :
              <Button onClick={saveUserName}>Save</Button>
          }
        </Group>
        <Text>Email: {profileData.email}</Text>
        <StatsControls statValues={profileData}></StatsControls>
      </Stack>
    </Center>
  )
}

function ClaimUserName({ userNames, profileData, selectedUserNameToUpdate, setSelectedUserNameToUpdate }) {

  const [newUsername, setNewUsername] = useState("");
  const [comments, setComments] = useState("");
  const [opened, setOpened] = useState(false);

  const requestClaimUserName = async () => {

    const data = {
      currentUserName: profileData.userName,
      oldUserName: selectedUserNameToUpdate,
      newUserName: newUsername
    }
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
          title: 'Request submitted',
          message: 'Please check your email for further instructions'
        })
        setOpened(false)
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

  const updateComments = (e) => {
    setComments(e.target.value)
  }

  const sendMessage = async () => {
    const data = {
      description: comments
    }
    const authId = await getIdTokenOfUser();
    fetch(import.meta.env.VITE_API + "/users/sendMessage", {
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
          title: 'Thank you',
          message: 'Your message has been sent'
        })
        setComments("")
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
  }

  return (
    <Center>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="What do you want your username to be henceforth?"
      >
        <Stack>
          <SegmentedControl
            data={[
              { label: profileData.userName, value: profileData.userName },
              { label: selectedUserNameToUpdate, value: selectedUserNameToUpdate }
            ]}
            value={newUsername}
            onChange={setNewUsername}
          />
          <Button onClick={requestClaimUserName} disabled={newUsername.length === 0}>Submit request</Button>
        </Stack>
      </Modal>

      <Stack>
        <Group>
          <Select
            data={userNames}
            value={selectedUserNameToUpdate}
            onChange={setSelectedUserNameToUpdate}
            placeholder="Select your old username"
            searchable
          ></Select>
          {/* TODO: Give an option for user to select what they want their new username as */}
          <Button disabled={selectedUserNameToUpdate === "" ? true : false} onClick={() => setOpened(true)}>Claim username!</Button>
        </Group>
        {/* <Group> */}
        <Textarea
          placeholder="Your comment"
          label="Your comment" onChange={updateComments} value={comments} />
        <Button disabled={comments.length == 0 ? true : false} onClick={sendMessage}>Submit</Button>
        {/* </Group> */}
      </Stack>
    </Center>
  )
}
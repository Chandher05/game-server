
import { useState, useEffect } from 'react';
import { Button, Select, Modal, SegmentedControl, Center, Stack, Text, Group, ActionIcon, Textarea } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { IconPencil } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

function Account() {
  const [profileData, setProfileData] = useState([]);
  const [playerUserName, setProfileUserName] = useState("");
  const [editDisabled, setEditDisabled] = useState(true);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserNameToUpdate, setSelectedUserNameToUpdate] = useState("");
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
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
      }
    });



    fetch(import.meta.env.VITE_API + "/users/userNames", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        response.json().then(json => {
          setUserNames(json)
        })
      }
    });


  }, [])
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

  const authId = useStoreState((state) => state.authId);
  const changeUserName = (e) => {
    setProfileUserName(e.target.value)
  }

  const toggleEdit = (e) => {
    setEditDisabled(!editDisabled)
  }

  const saveUserName = () => {
    const data = {
      newUserName: playerUserName
    }
    fetch(import.meta.env.VITE_API + "/users/update", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) setEditDisabled(!editDisabled)
      // TODO: Error message
    });
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
        <Group>
          <Text>Wins: {profileData.totalWins}</Text>
          <Text>Declares: {profileData.totalDeclares}</Text>
          <Text>+50's: {profileData.totalFifties}</Text>
          <Text>-25's: {profileData.totalPairs}</Text>
        </Group>
        <Text>Total games: {profileData.totalGames}</Text>
      </Stack>
    </Center>
  )
}

function ClaimUserName({ userNames, profileData, selectedUserNameToUpdate, setSelectedUserNameToUpdate }) {

  const [newUsername, setNewUsername] = useState("");
  const [comments, setComments] = useState("");
  const [opened, setOpened] = useState(false);
  const authId = useStoreState((state) => state.authId);


  const requestClaimUserName = async () => {

    const data = {
      currentUserName: profileData.userName,
      oldUserName: selectedUserNameToUpdate,
      newUserName: newUsername
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
          title: 'Request submitted',
          message: 'Please check your email for further instructions'
        })
        setOpened(false)
      } else {
        throw new Error(response)
      }
    }).catch((error) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: 'Please refresh the page and try again'
      })
    })
  };

  const updateComments = (e) => {
    setComments(e.target.value)
  }

  const sendMessage = () => {
    const data = {
      description: comments
    }
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
        throw new Error(response)
      }
    }).catch((error) => {
      showNotification({
        variant: 'outline',
        color: 'red',
        title: 'Something went wrong!',
        message: 'Please refresh the page and try again'
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
          <Button onClick={requestClaimUserName} disabled={newUsername.length===0}>Submit request</Button>
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
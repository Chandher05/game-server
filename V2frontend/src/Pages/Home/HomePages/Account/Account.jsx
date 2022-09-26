
import { useState, useEffect } from 'react';
import { Button, Select, Modal, SegmentedControl } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { IconPencil } from '@tabler/icons';

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
    <div style={{ margin: '10px', padding: '100px' }}>
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
    <Center >
      <Stack spacing='xs'>
        <Group>
          <Text>Username: <input type="text" value={playerUserName} onChange={changeUserName} disabled={editDisabled} /></Text>
          {
            editDisabled ?
              <ActionIcon onClick={toggleEdit} ><IconPencil /></ActionIcon> :
              <Button onClick={saveUserName}>Save</Button>
          }
        </Group>
        <Text>Email: {profileData.email}</Text>
        <Text>Total games: {profileData.totalGames}</Text>
        <Text>Wins: {profileData.totalWins}</Text>
        <Text>Declares: {profileData.totalDeclares}</Text>
        <Text>+50's: {profileData.totalFifties}</Text>
        <Text>-25's: {profileData.totalPairs}</Text>
      </Stack>
    </Center>
  )
}

function ClaimUserName({ userNames, profileData, selectedUserNameToUpdate, setSelectedUserNameToUpdate }) {

  const [instruction, setInstruction] = useState([]);
  const [newUsername, setNewUsername] = useState(profileData.userName);
  const [opened, setOpened] = useState(false);
  const authId = useStoreState((state) => state.authId);


  const requestClaimUserName = async () => {

    const data = {
      currentUserName: profileData.userName,
      oldUserName: selectedUserNameToUpdate,
      newUserName: newUsername
    }
    console.log(data)
    fetch(import.meta.env.VITE_API + "/users/claim", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) {
        setInstruction("Check your email");
        setOpened(false)
      }
      // TODO: Error response
    });
  }; ß


  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="What do you want your username to be henceforth?"
      >

        <SegmentedControl
          data={[
            { label: profileData.userName, value: profileData.userName },
            { label: selectedUserNameToUpdate, value: selectedUserNameToUpdate }
          ]}
          value={newUsername}
          onChange={setNewUsername}
        />
        <Button onClick={requestClaimUserName}>Submit request</Button>
      </Modal>


      <Select
        data={userNames}
        value={selectedUserNameToUpdate}
        onChange={setSelectedUserNameToUpdate}
        placeholder="Select your old username"
        searchable
      ></Select>
      {/* TODO: Give an option for user to select what they want their new username as */}
      <Button disabled={selectedUserNameToUpdate === "" ? true : false} onClick={() => setOpened(true)}>Claim username!</Button>
      <p>{instruction}</p>
    </>
  )
}
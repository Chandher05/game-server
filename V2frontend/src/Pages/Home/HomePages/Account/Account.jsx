
import { useState, useEffect } from 'react';
import { Button } from "@mantine/core";
import { Table } from "@mantine/core";
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
          setSelectedUserNameToUpdate(json[0])
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
    <div>
      <p>Username: <input type="text" value={playerUserName} onChange={changeUserName} disabled={editDisabled} /></p>
      {
        editDisabled ?
          <IconPencil onClick={toggleEdit} /> :
          <Button onClick={saveUserName}>Save</Button>
      }
      <p>Email: {profileData.email}</p>
      <p>Total games: {profileData.totalGames}</p>
      <p>Wins: {profileData.totalWins}</p>
      <p>Declares: {profileData.totalDeclares}</p>
      <p>+50's: {profileData.totalFifties}</p>
      <p>-25's: {profileData.totalPairs}</p>
    </div>
  )
}

function ClaimUserName({ userNames, profileData, selectedUserNameToUpdate, setSelectedUserNameToUpdate }) {

  const [instruction, setInstruction] = useState([]);
  const authId = useStoreState((state) => state.authId);

  const changeSelectedUserName = (e) => {
    console.log(e.target.value)
    setSelectedUserNameToUpdate(e.target.value)
  }

  const requestClaimUserName = async () => {

    const data = {
      currentUserName: profileData.userName,
      oldUserName: selectedUserNameToUpdate,
      newUserName: profileData.userName,
    }
    fetch(import.meta.env.VITE_API + "/users/claim", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) setInstruction("Check your email. Give an option for user to select what they want their new username as (Old or new)");
      // TODO: Error response
    });
  };

  const rows = userNames.map(function (element) {
    if (profileData.userName != element) {
      return <option value={element} key={element}>{element}</option>
    }
  });

  return (
    <div>
      <select value={selectedUserNameToUpdate} onChange={changeSelectedUserName}>
        {rows}
      </select>
      {/* TODO: Give an option for user to select what they want their new username as */}
      <button onClick={requestClaimUserName}>Claim username!</button>
      <p>{instruction}</p>
    </div>
  )
}
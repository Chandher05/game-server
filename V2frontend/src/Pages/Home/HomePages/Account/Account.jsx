
import { useState, useEffect } from 'react';
import { Table } from "@mantine/core";
import { useStoreState } from 'easy-peasy';
import { IconPencil } from '@tabler/icons';

function Account() {
  const [profileData, setProfileData] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/users/profile", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setProfileData(await response.json());
    });

    fetch(import.meta.env.VITE_API + "/users/userNames", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setUserNames(await response.json());
    });


  }, [])
  return (
    // Can we add send message also in this page?
    <div>
      <Stats profileData={profileData} />
      <ClaimUserName userNames={userNames} profileData={profileData} />
    </div>
  )
}

export default Account;

function Stats({ profileData }) {

  // TODO: Edit and update username
  return (
    <div>
      <p>Username: <input type="text" value={profileData.userName} name="username" /><IconPencil /></p>
      <p>Total games: {profileData.totalGames}</p>
      <p>Wins: {profileData.totalWins}</p>
      <p>Declares: {profileData.totalDeclares}</p>
      <p>+50's: {profileData.totalFifties}</p>
      <p>-25's: {profileData.totalPairs}</p>
    </div>
  )
}

function ClaimUserName({ userNames, profileData }) {

  const [instruction, setInstruction] = useState([]);
  const authId = useStoreState((state) => state.authId);

  const rows = userNames.map(function (element) {
    if (profileData.userName != element) {
      return <option value={element}>{element}</option>
    }
  });

  const requestClaimUserName = async () => {

    const data = {
      currentUserName: profileData.userName,
      oldUserName: userNames[0],
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
      if (response.ok) setInstruction("Check your email");
      // TODO: Error response
    });

  };

  return (
    <div>
      <select>
        {rows}
      </select>
      {/* TODO: Give an option for user to select what they want their new username as */}
      <button onClick={requestClaimUserName}>Claim username!</button>
      <p>{instruction}</p>
    </div>
  )
}
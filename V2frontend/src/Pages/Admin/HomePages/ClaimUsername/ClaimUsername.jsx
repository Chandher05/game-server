import { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

function ClaimUserName() {
  const [userNames, setUserNames] = useState([]);
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/users/userNames", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setUserNames(await response.json())
    });


  }, [])

  return <Demo userNames={userNames}></Demo>
}

export default ClaimUserName;

function Demo({ userNames }) {
  const [instruction, setInstruction] = useState([]);
  const claimUserNameAPI = async () => {

    const data = {
      currentUserName: "",
      oldUserName: "",
      newUserName: "",
    }
    fetch(import.meta.env.VITE_API + "/users/claim", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data)
    }).then(async (response) => {
      if (response.ok) setInstruction("Success");
      // TODO: Error response
    });

  };

  const oldUserNameRows = userNames.map(function (element) {
    return <option value={element}>{element}</option>
  });
  const ocurrentUserNameRows = userNames.map(function (element) {
    return <option value={element}>{element}</option>
  });
  const newUserNameRows = userNames.map(function (element) {
    return <option value={element}>{element}</option>
  });

  return (
    <div>
      Old Username
      <select>
        {oldUserNameRows}
      </select>
      Current Username
      <select>
        {ocurrentUserNameRows}
      </select>
      New Username
      <select>
        {newUserNameRows}
      </select>
      {/* TODO: Give an option for user to select what they want their new username as */}
      <button onClick={claimUserNameAPI}>Claim username!</button>
      <p>{instruction}</p>
    </div>
  )
}


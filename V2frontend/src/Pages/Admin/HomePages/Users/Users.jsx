
import { useState, useEffect } from 'react';
import { Table } from "@mantine/core";
import { useStoreState } from 'easy-peasy';

function Users() {
  const [data, setData] = useState([]);
  const authId = sessionStorage.getItem('access_token');

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/admin/allUsers", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setData(await response.json());
    });
  }, [])

  return <Demo data={data}></Demo>
}

export default Users;

function Demo({ data }) {

  const rows = data.map((element) => (
    <UserRow element={element}></UserRow>
  ));

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>ID</th>
          <th>UID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Is Active</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

function UserRow({ element }) {


  const authId = sessionStorage.getItem('access_token');

  const deactivateUser = () => {
    fetch(import.meta.env.VITE_API + `/admin/deactivate/${element._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setData(await response.json());
    });
  }


  return (
    <tr key={element._id}>
      <td>{element._id}</td>
      <td>{element.userUID}</td>
      <td>{element.userName}</td>
      <td>{element.email}</td>
      <td>{element.isActive ? "TRUE" : "FALSE"}</td>
      {/* TODO: Show a pop up to confirm before deactiving */}
      <td>{element.isActive ? <button onClick={deactivateUser}>Deactivate</button> : ""}</td>
    </tr>
  )
}


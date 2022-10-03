
import { useState, useEffect } from 'react';
import { Table } from "@mantine/core";
import { useStoreState } from 'easy-peasy';

function Messages() {
  const [data, setData] = useState([]);
  const authId = sessionStorage.getItem('access_token');

  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/admin/messages", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setData(await response.json());
    });
  }, [])

  return <Demo data={data}></Demo>
}

export default Messages;

function Demo({ data }) {

  const rows = data.map((element) => (
    <UserRow element={element}></UserRow>
  ));

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>From UID</th>
          <th>From email</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

function UserRow({ element }) {


  const authId = sessionStorage.getItem('access_token');

  const markMessageAsSeen = () => {
    fetch(import.meta.env.VITE_API + `/admin/messages/seen/${element._id}`, {
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
      <td>{element.userUID}</td>
      <td>{element.email}</td>
      <td>{element.subject}</td>
      <td>{element.body}</td>
      <td>{element.createdAt}</td>
      {/* TODO: Show a pop up to confirm before marking seen */}
      <td>{element.seen ? "" : <button onClick={markMessageAsSeen}>Mark Seen</button>}</td>
    </tr>
  )
}


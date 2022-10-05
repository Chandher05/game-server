
import { useState } from 'react';
import { IconGauge, IconActivity, IconColumns, IconMessage, IconUser, IconAdjustmentsAlt } from '@tabler/icons';
import { Box, NavLink, Navbar as Nav } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const data = [
  { icon: IconUser, label: 'Users', url: '' },
  { icon: IconGauge, label: 'Claim username', url: 'claim' },
  { icon: IconMessage, label: 'Messages', url: 'messages' }
];

function NavLinks({ setOpened }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const onClickNavigate = (index) => {
    setOpened(false)
    navigate(data[index].url);
    setActive(index)
  }

  const items = data.map((item, index) => (
    <NavLink
      key={item.label}
      active={index === active}
      label={item.label}

      icon={<item.icon size={16} stroke={1.5} />}
      onClick={() => onClickNavigate(index)}
    />
  ));

  return <Box sx={{ width: '100%' }}>{items}</Box>;
}

function Navbar({ opened, setOpened }) {
  return (
    <Nav hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      <NavLinks setOpened={setOpened}></NavLinks>
    </Nav>
  )
}
export default Navbar;
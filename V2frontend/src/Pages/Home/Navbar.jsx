
import { useState } from 'react';
import { IconActivity, IconColumns, IconTrophy, IconUser, IconAdjustmentsAlt, IconLogout } from '@tabler/icons';
import { Box, NavLink, Navbar as Nav, ActionIcon, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Providers/Firebase/config'

const data = [
  { icon: IconActivity, label: 'Game Room', url: '' },
  { icon: IconAdjustmentsAlt, label: 'View Rules', url: 'rules' },
  { icon: IconUser, label: 'Account', url: 'account' },
  { icon: IconTrophy, label: 'Hall of Fame ', url: 'halloffame' },
  { icon: IconColumns, label: 'Leaderboard ', url: 'leaderboard' },
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
      <Nav.Section grow>
        <NavLinks setOpened={setOpened}></NavLinks>
      </Nav.Section>
      <Nav.Section style={{ padding: '20px' }}>
        <Button fullWidth variant="outline" leftIcon={<IconLogout />} color="red" onClick={logout}>
          Logout
        </Button>
      </Nav.Section>
    </Nav>
  )
}
export default Navbar;
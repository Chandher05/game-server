
import { useState } from 'react';
import { IconGauge, IconActivity, IconColumns, IconTrophy, IconUser, IconAdjustmentsAlt } from '@tabler/icons';
import { Box, NavLink, Navbar as Nav } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const data = [
  { icon: IconActivity, label: 'Users', url: '' },
  { icon: IconAdjustmentsAlt, label: 'Claim username', url: 'claim' },
  { icon: IconUser, label: 'Messages', url: 'messages' }
];

function NavLinks({ }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const onClickNavigate = (index) => {
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

function Navbar() {
  return (
    <Nav width={{ base: 300 }} height={"100%"} p="xs">
      <NavLinks></NavLinks>
    </Nav>
  )
}
export default Navbar;
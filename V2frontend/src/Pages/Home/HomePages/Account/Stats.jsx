import { useState } from 'react';

import { createStyles, UnstyledButton, Text, Paper, Group, Center } from '@mantine/core';
import { IconSwimming, IconBike, IconRun, IconChevronDown, IconChevronUp } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${theme.colors[theme.primaryColor][7]
      } 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    maxWidth: '500px',
    display: 'flex',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  icon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.lg,
    color: theme.colors[theme.primaryColor][6],
  },

  stat: {
    minWidth: 70,
    paddingTop: theme.spacing.md,
    minHeight: 60,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.white,
  },

  label: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: theme.fontSizes.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.gray[6],
    lineHeight: 1.2,
  },

  value: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    color: theme.black,
  },

  count: {
    color: theme.colors.gray[6],
  },




}));

export function StatsControls({ statValues }) {
  const { classes } = useStyles();
  const { totalGames, totalWins, totalDeclares, totalFifties, totalPairs } = statValues;
  const data = [
    { label: 'Total Games', val: totalGames },
    { label: 'Wins', val: totalWins },
    { label: 'Declares', val: totalDeclares },
    { label: '+50s', val: totalFifties },
    { label: '-25s', val: totalPairs },
  ];

  const stats = data.map((stat) => (
    <Paper className={classes.stat} radius="md" shadow="md" p="xs" key={stat.label}>
      <Text>{stat.val}</Text>
      <div>
        <Text className={classes.label}>{stat.label}</Text>
      </div>
    </Paper>
  ));

  return (
    <Center>
      <div className={classes.root}>
        <Group sx={{ flex: 1 }}>{stats}</Group>
      </div>
    </Center>
  );
}
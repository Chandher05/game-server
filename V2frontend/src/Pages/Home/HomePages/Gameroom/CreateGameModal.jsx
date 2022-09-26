import { useState } from 'react';
import { Modal, Group, SegmentedControl, Button } from '@mantine/core'


//TO-DO - Defaults to not be hardcoded


function CreateGameModal({ opened, setOpened, createGame }) {
  const [maxScore, setMaxScore] = useState(100);
  const [scoreWhenEndWithPair, setScoreWhenEndWithPair] = useState(-25);
  const [scoreWhenWrongCall, setScoreWhenWrongCall] = useState(50);
  const [canDeclareFirstRound, setCanDeclareFirstRound] = useState(true);
  const [autoplayTimer, setAutoplayTimer] = useState(60);
  const [isPublicGame, setIsPublicGame] = useState(false);


  function done() {
    createGame(maxScore, scoreWhenEndWithPair, scoreWhenWrongCall, canDeclareFirstRound, autoplayTimer, isPublicGame);
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Game settings"
    >
      <Group position="apart" p={3}>
        Max score
        <SegmentedControl
          data={[
            { label: 100, value: 100 },
            { label: 200, value: 200 },
            { label: 250, value: 250 }
          ]}
          transitionDuration={250}
          value={maxScore}
          onChange={setMaxScore}
        />
      </Group>

      <Group position="apart" p={3}>
        Ending with a pair
        <SegmentedControl
          data={[
            { label: -15, value: -15 },
            { label: -25, value: -25 },
            { label: -40, value: -40 }
          ]}
          transitionDuration={250}
          value={scoreWhenEndWithPair}
          onChange={setScoreWhenEndWithPair}
        />
      </Group>

      <Group position="apart" p={4}>
        Score for wrong call
        <SegmentedControl
          data={[
            { label: 25, value: 25 },
            { label: 50, value: 50 },
            { label: 75, value: 75 }
          ]}
          transitionDuration={250}
          value={scoreWhenWrongCall}
          onChange={setScoreWhenWrongCall}
        /></Group>

      <Group position="apart" p={4}>
        Can declare first round
        <SegmentedControl
          data={[
            { label: "YES", value: true },
            { label: "NO", value: false }
          ]}
          transitionDuration={250}
          value={canDeclareFirstRound}
          onChange={setCanDeclareFirstRound}
        /></Group>


      <Group position="apart" p={4}>
        Autoplay timer
        <SegmentedControl
          color={'red'}
          data={[
            { label: '45s', value: 45 },
            { label: '60s', value: 60 },
            { label: '90s', value: 90 }
          ]}
          transitionDuration={250}
          value={autoplayTimer}
          onChange={setAutoplayTimer}
        /></Group>

      <Group position="apart" p={4}>
        Public game
        <SegmentedControl
          data={[
            { label: "YES", value: true },
            { label: "NO", value: false }
          ]}
          transitionDuration={250}
          value={isPublicGame}
          onChange={setIsPublicGame}
        />
      </Group>
      <Group position="right" p={6}>
        <Button onClick={done}>Create Game</Button>
      </Group>
    </Modal>
  )
}

export default CreateGameModal;
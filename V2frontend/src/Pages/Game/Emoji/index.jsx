

import { useState } from 'react';
import { useInterval } from "./useInterval";
import { createStyles, keyframes } from '@mantine/core';

import { Reactions } from '../../../Providers/Socket/listeners';



const falldown = keyframes({
  "0%": { marginTop: '0' },
  "100%": { marginTop: '100vh' },
})

const useStyles = createStyles((theme) => ({
  SuperContainer: {
    display: "flex",
    alignItems: "center",
    width: "100vw",
  },
  EmojiContainer: {
    position: 'absolute',
    top: '80px',

    fontSize: "48px",
    animation: `${falldown} 4s`,
  }
}));


function EmojiRain({ emoji }) {

  const { classes } = useStyles();
  const [emojisToRender, setEmojisToRender] = useState([{ offset: 0, key: 0, emoji: '' }]);

  useInterval(() => {
    if (emojisToRender.length > 20) {
      emojisToRender.shift();
    }
    const offset = Math.floor(Math.random() * 100);
    const key = offset + Math.random() * 1000000;
    // const emoji = '🔥';

    emojisToRender.push({ offset, key, emoji });

    setEmojisToRender([...emojisToRender]);
  }, 100);




  return (
    <div className={classes.SuperContainer}>
      {emojisToRender.map(({ key, emoji, offset }) => {
        return (
          <div className={classes.EmojiContainer} style={{ left: `${offset - 5}vw` }} key={key} offset={offset}>
            {emoji}
          </div>);
      })}
    </div>
  );
}


function Emoji() {
  const [display, setDisplay] = useState(false);
  const [emoji, setEmoji] = useState('🔥');

  Reactions((status, body) => {
    if (status == "SUCCESS") {
      setEmoji(body.data);
      setDisplay(true);
      setTimeout(() => setDisplay(false), 5000)
    }
  })

  return (
    <>
      {display ? <EmojiRain emoji={emoji}></EmojiRain> : <></>}
    </>
  )

}

export default Emoji;


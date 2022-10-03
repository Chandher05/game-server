import { createStyles, Container, Group, Card, Image, Text, Grid, Title, Anchor } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundImage: `linear-gradient(20deg, rgba(2,0,36,1) 0%, rgba(40,40,113,1) 65%, rgba(0,212,255,1) 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
  },
  cardOutside: {
    backgroundImage: `linear-gradient(210deg, rgba(2,0,36,1) 0%, rgba(40,40,113,1) 90%, rgba(0,212,255,1) 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
  }
}));

function HallOfFame() {
  const { classes } = useStyles();
  return (

    <>
      <Container m={4}>
        <Card className={classes.cardOutside}>
          <Grid justify="center" align="center" >
            <Grid.Col span={6} >
              <Card
                shadow="lg"
                p="xl"
                className={classes.card}
              >
                <Title order={2}>Tournament 2</Title>

                <Card.Section>
                  <Image src="/HallOfFame/winner-2.jpeg" alt="winner-1" />
                </Card.Section>

                <Text weight={500} size="lg" mt="md">
                  Winner: Shaivya Sahare
                </Text>

                <Text mt="xs" color="dimmed" size="sm">
                  Shaivya used to the winnings from this tournament to help a organization who is trying to help street vendors rebuild their businesses post
                  COVID. <Anchor href="https://fundraisers.giveindia.org/fundraisers/empowering-our-street-vendors-to-rebuild-their-livelihoods" target="_blank" rel="noopener noreferrer">Link to the fundraiser</Anchor>
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text style={{ fontSize: '14px' }}>
                On 23rd of January 2021, a group of people were notified about the second ever edition of the Declare Championship,
                a chance for worthy contenders to be <i>declared</i> champion.
                Each of the contenders was given a day’s notice to show up to the event, and of course, those whose plans were to
                just play declare on a Sunday night showed up for what would turn out to be a dramatic, thrilling and
                competitive-as-France championship
                <br />
                <br />
                Heartbreaks, internet issues, panic, suspense – all of these graced the championship the way the contenders did. Charu,
                Shaivya and Teja entered the finals after their own commendable victories, and as Declare championships usually play out,
                each loser had a shot at the wild-card entry. Jishnu clinched the fourth spot at the finals, joining what would become a long
                and nail-biting finish. Multiple rounds, a 150 on the scoreboard and many -25s later, 3 finalists won two games each, making the
                last game the decider. Through all this, one finalist showed immense grit, intent and consistency. Shaivya Sahare was declared
                champion. She thanked Jishnu's 150, Charu's internet, and Teja's well, nothing because he was perfect and she doesn’t know why
                he lost, and the Gods of declare for their kindness, but we know she deserved it!
                <br />
                <br />
                A huge thank you to the participants for sticking to your declare plan on Sunday night ;) and for bringing to this championship all
                that energy and enthusiasm. There’s no championship without banter, and all of you delivered and HOW. On 25th January, the second
                edition of the Declare Championship came to an end. This isn’t a <b>goodbye</b>, but
                a <b>see you in the next edition.</b> Au revoir, keep playing!
              </Text>
            </Grid.Col>
          </Grid>
        </Card>

      </Container>

      <Container m={4}>
        <Card className={classes.cardOutside}>
          <Grid justify="center" align="center" >
            <Grid.Col span={6} >
              <Card
                shadow="lg"
                p="xl"
                className={classes.card}
              >
                <Title order={2}>Tournament 1</Title>

                <Card.Section>
                  <Image src="/HallOfFame/winner-1.jpeg" alt="winner-1" />
                </Card.Section>

                <Text weight={700} size="lg" mt="md">
                  Winner: Jayasurya Pinaki
                </Text>

                <Text mt="xs" color="dimmed" size="sm">
                  Shaivya used to the winnings from this tournament to help a organization who is trying to help street vendors rebuild their businesses post
                  COVID. <Anchor href="https://fundraisers.giveindia.org/fundraisers/empowering-our-street-vendors-to-rebuild-their-livelihoods" target="_blank" rel="noopener noreferrer">Link to the fundraiser</Anchor>
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text style={{ fontSize: '14px' }}>
                <p>
                  Declare is a simple card game. This game was being played by a group
                  of friends for years has now become an international tournament. The
                  journey has been incredible.
                </p>

                <p>
                  When so many things moved online due to the pandemic, Declare was also
                  destined to move online as well. It has been a joy to share this game
                  with all of you. With the increasing popularity of the game, we decided
                  to have a tournament. The first-ever Declare tournament was conducted on
                  5th Sept and 6th Sept of 2020. The tournament had 16 sign-ups, and it
                  has been one incredible tournament. A big thank you to all the
                  participants for making this an amazing success.
                </p>
                <p><span >Semi finalists: </span>Aditya Vaidyanathan, Jampana Sriteja, Jishnu Mohan</p>
                <h4>Participants: <span>Ameya Vaidyanathan, Arshmeen Baveja, Chandher Shekar R, Charumitra Sardana, Karthekeyan Sampath, Lipi Bag, Nitish Kumar, Shaivya Sahare, Sravanth Km</span></h4>
                <br />
                <h3><span>MVP:</span> ANJALI <i>Clutch Queen</i> RAMESH for her never dying attitude</h3>
              </Text>
            </Grid.Col>
          </Grid>
        </Card>

      </Container>

    </>
  )

}


export default HallOfFame;


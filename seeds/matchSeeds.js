const createDate = (daysOffset, hoursOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(date.getHours() + hoursOffset);
    return date;
  };
  
  module.exports = [
    {
      tournamentName: 'ESL Pro League',
      tournamentLogo: '/images/tournaments/esl.png',
      date: createDate(2),
      game: 'csgo',
      opponentName: 'Natus Vincere',
      opponentLogo: '/images/teams/navi.png',
      streamUrl: 'https://twitch.tv/esl_csgo',
      status: 'upcoming'
    },
    {
      tournamentName: 'BLAST Premier',
      tournamentLogo: '/images/tournaments/blast.png',
      date: createDate(4, 3),
      game: 'csgo',
      opponentName: 'Team Liquid',
      opponentLogo: '/images/teams/liquid.png',
      status: 'upcoming'
    },
    {
      tournamentName: 'IEM Katowice',
      tournamentLogo: '/images/tournaments/iem.png',
      date: createDate(-5),
      game: 'csgo',
      opponentName: 'Astralis',
      opponentLogo: '/images/teams/astralis.png',
      furiaScore: 2,
      opponentScore: 0,
      highlightsUrl: 'https://youtube.com/watch?v=highlight1',
      status: 'completed'
    },
    {
      tournamentName: 'BLAST Premier Fall',
      tournamentLogo: '/images/tournaments/blast.png',
      date: createDate(-10),
      game: 'csgo',
      opponentName: 'G2 Esports',
      opponentLogo: '/images/teams/g2.png',
      furiaScore: 1,
      opponentScore: 2,
      highlightsUrl: 'https://youtube.com/watch?v=highlight2',
      status: 'completed'
    },
    
    {
      tournamentName: 'VALORANT Champions',
      tournamentLogo: '/images/tournaments/valorant-champions.png',
      date: createDate(3),
      game: 'valorant',
      opponentName: 'Sentinels',
      opponentLogo: '/images/teams/sentinels.png',
      streamUrl: 'https://twitch.tv/valorant',
      status: 'upcoming'
    },
    {
      tournamentName: 'VCT Americas',
      tournamentLogo: '/images/tournaments/vct.png',
      date: createDate(7),
      game: 'valorant',
      opponentName: '100 Thieves',
      opponentLogo: '/images/teams/100t.png',
      status: 'upcoming'
    },
    {
      tournamentName: 'VCT Brazil',
      tournamentLogo: '/images/tournaments/vct.png',
      date: createDate(-7),
      game: 'valorant',
      opponentName: 'LOUD',
      opponentLogo: '/images/teams/loud.png',
      furiaScore: 1,
      opponentScore: 2,
      highlightsUrl: 'https://youtube.com/watch?v=highlight3',
      status: 'completed'
    },
    {
      tournamentName: 'VCT Americas',
      tournamentLogo: '/images/tournaments/vct.png',
      date: createDate(-15),
      game: 'valorant',
      opponentName: 'NRG',
      opponentLogo: '/images/teams/nrg.png',
      furiaScore: 2,
      opponentScore: 1,
      highlightsUrl: 'https://youtube.com/watch?v=highlight4',
      status: 'completed'
    }
  ];
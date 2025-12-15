import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

// NHL Team IDs for logos
const TEAM_LOGOS = {
  'Florida Panthers': 13,
  'Toronto Maple Leafs': 10,
  'Tampa Bay Lightning': 14,
  'Boston Bruins': 6,
  'Buffalo Sabres': 7,
  'Ottawa Senators': 9,
  'Detroit Red Wings': 17,
  'Montreal Canadiens': 8,
  'Carolina Hurricanes': 12,
  'New York Rangers': 3,
  'Washington Capitals': 15,
  'New York Islanders': 2,
  'Pittsburgh Penguins': 5,
  'Philadelphia Flyers': 4,
  'New Jersey Devils': 1,
  'Columbus Blue Jackets': 29,
  'Dallas Stars': 25,
  'Colorado Avalanche': 21,
  'Winnipeg Jets': 52,
  'Nashville Predators': 18,
  'Minnesota Wild': 30,
  'St. Louis Blues': 19,
  'Arizona Coyotes': 53,
  'Chicago Blackhawks': 16,
  'Vegas Golden Knights': 54,
  'Edmonton Oilers': 22,
  'Los Angeles Kings': 26,
  'Vancouver Canucks': 23,
  'Seattle Kraken': 55,
  'Calgary Flames': 20,
  'Anaheim Ducks': 24,
  'San Jose Sharks': 28
};

// NHL Teams Data - organized by division
const NHL_TEAMS = {
  atlantic: [
    'Florida Panthers', 'Toronto Maple Leafs', 'Tampa Bay Lightning',
    'Boston Bruins', 'Buffalo Sabres', 'Ottawa Senators',
    'Detroit Red Wings', 'Montreal Canadiens'
  ],
  metropolitan: [
    'Carolina Hurricanes', 'New York Rangers', 'Washington Capitals',
    'New York Islanders', 'Pittsburgh Penguins', 'Philadelphia Flyers',
    'New Jersey Devils', 'Columbus Blue Jackets'
  ],
  central: [
    'Dallas Stars', 'Colorado Avalanche', 'Winnipeg Jets',
    'Nashville Predators', 'Minnesota Wild', 'St. Louis Blues',
    'Arizona Coyotes', 'Chicago Blackhawks'
  ],
  pacific: [
    'Vegas Golden Knights', 'Edmonton Oilers', 'Los Angeles Kings',
    'Vancouver Canucks', 'Seattle Kraken', 'Calgary Flames',
    'Anaheim Ducks', 'San Jose Sharks'
  ]
};

// Component to render team with logo
const TeamDisplay = ({ teamName, isWinner = false, isButton = false, onClick }) => {
  const teamId = TEAM_LOGOS[teamName];
  const logoUrl = teamId ? `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${teamId}.svg` : null;

  const content = (
    <div className={`flex items-center gap-2 ${isButton ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${teamName} logo`}
          className="w-6 h-6 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <span className={isWinner ? 'text-green-400 font-bold' : 'text-gray-300'}>
        {teamName}
      </span>
    </div>
  );

  if (isButton) {
    return (
      <button onClick={onClick} className="w-full text-left p-2 rounded-lg hover:bg-opacity-20 transition-all">
        {content}
      </button>
    );
  }

  return content;
};

// Bracket Generation Logic
const generatePlayoffBracket = () => {
  // Randomly select playoff teams (3 from each division + 2 wildcards per conference)
  const getRandomTeams = (division, count) => {
    const shuffled = [...NHL_TEAMS[division]].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Eastern Conference
  const atlanticTeams = getRandomTeams('atlantic', 3);
  const metroTeams = getRandomTeams('metropolitan', 3);
  const eastWildcards = [
    ...NHL_TEAMS.atlantic.filter(t => !atlanticTeams.includes(t)),
    ...NHL_TEAMS.metropolitan.filter(t => !metroTeams.includes(t))
  ].sort(() => Math.random() - 0.5).slice(0, 2);

  // Western Conference
  const centralTeams = getRandomTeams('central', 3);
  const pacificTeams = getRandomTeams('pacific', 3);
  const westWildcards = [
    ...NHL_TEAMS.central.filter(t => !centralTeams.includes(t)),
    ...NHL_TEAMS.pacific.filter(t => !pacificTeams.includes(t))
  ].sort(() => Math.random() - 0.5).slice(0, 2);

  // Create matchups with seeding
  const eastMatchups = [
    { team1: atlanticTeams[0], team2: eastWildcards[1], seed1: 'A1', seed2: 'WC2' },
    { team1: atlanticTeams[1], team2: atlanticTeams[2], seed1: 'A2', seed2: 'A3' },
    { team1: metroTeams[0], team2: eastWildcards[0], seed1: 'M1', seed2: 'WC1' },
    { team1: metroTeams[1], team2: metroTeams[2], seed1: 'M2', seed2: 'M3' }
  ];

  const westMatchups = [
    { team1: centralTeams[0], team2: westWildcards[1], seed1: 'C1', seed2: 'WC2' },
    { team1: centralTeams[1], team2: centralTeams[2], seed1: 'C2', seed2: 'C3' },
    { team1: pacificTeams[0], team2: westWildcards[0], seed1: 'P1', seed2: 'WC1' },
    { team1: pacificTeams[1], team2: pacificTeams[2], seed1: 'P2', seed2: 'P3' }
  ];

  return { eastMatchups, westMatchups };
};

// Component
export default function NHLBracketGenerator() {
  const [bracket, setBracket] = useState(null);
  const [eastRound1Winners, setEastRound1Winners] = useState([]);
  const [eastRound2Winners, setEastRound2Winners] = useState([]);
  const [eastFinal, setEastFinal] = useState(null);
  const [westRound1Winners, setWestRound1Winners] = useState([]);
  const [westRound2Winners, setWestRound2Winners] = useState([]);
  const [westFinal, setWestFinal] = useState(null);
  const [champion, setChampion] = useState(null);

  const generateNewBracket = () => {
    const newBracket = generatePlayoffBracket();
    setBracket(newBracket);
    setEastRound1Winners(new Array(4).fill(null));
    setEastRound2Winners(new Array(2).fill(null));
    setEastFinal(null);
    setWestRound1Winners(new Array(4).fill(null));
    setWestRound2Winners(new Array(2).fill(null));
    setWestFinal(null);
    setChampion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent">
            🏒 NHL Stanley Cup Playoff Bracket
          </h1>
          <button
            onClick={generateNewBracket}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <RefreshCw size={24} />
            Generate Random Bracket
          </button>
        </div>

        {/* Bracket Display */}
        {bracket && (
          <div className="space-y-8">
            {/* Eastern Conference */}
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/20 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <h2 className="text-4xl font-bold text-blue-300 mb-8 text-center drop-shadow-lg">
                Eastern Conference 🏒
              </h2>
              
              <div className="grid grid-cols-4 gap-4">
                {/* Round 1 */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Round 1</h3>
                  {bracket.eastMatchups.map((matchup, idx) => {
                    const winner = eastRound1Winners[idx];
                    if (winner) {
                      return (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 shadow-lg">
                          <div className={`mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                            <TeamDisplay teamName={matchup.team1} isWinner={winner === matchup.team1} />
                          </div>
                          <div className={`transition-all duration-300 ${winner === matchup.team2 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                            <TeamDisplay teamName={matchup.team2} isWinner={winner === matchup.team2} />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 shadow-lg">
                          <button
                            onClick={() => setEastRound1Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team1; return newW; })}
                            className="text-sm mb-1 w-full text-left hover:bg-blue-600/50 p-3 rounded-lg text-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                          >
                            <TeamDisplay teamName={matchup.team1} />
                          </button>
                          <button
                            onClick={() => setEastRound1Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                            className="text-sm w-full text-left hover:bg-blue-600/50 p-3 rounded-lg text-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                          >
                            <TeamDisplay teamName={matchup.team2} />
                          </button>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* Round 2 */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Round 2</h3>
                  {eastRound1Winners.every(w => w !== null) ? (
                    [
                      { team1: eastRound1Winners[0], team2: eastRound1Winners[1] },
                      { team1: eastRound1Winners[2], team2: eastRound1Winners[3] }
                    ].map((matchup, idx) => {
                      const winner = eastRound2Winners[idx];
                      if (winner) {
                        return (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-12">
                            <div className={`mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team1} isWinner={winner === matchup.team1} />
                            </div>
                            <div className={`transition-all duration-300 ${winner === matchup.team2 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team2} isWinner={winner === matchup.team2} />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-12">
                            <button
                              onClick={() => setEastRound2Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team1; return newW; })}
                              className="text-sm mb-1 w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team1} />
                            </button>
                            <button
                              onClick={() => setEastRound2Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team2} />
                            </button>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="text-gray-500 text-center mt-12">Complete Round 1 first</div>
                  )}
                </div>

                {/* Conference Finals */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Conference Final</h3>
                  {eastRound2Winners.every(w => w !== null) ? (
                    (() => {
                      const matchup = { team1: eastRound2Winners[0], team2: eastRound2Winners[1] };
                      const winner = eastFinal;
                      if (winner) {
                        return (
                          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-32">
                            <div className={`mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team1} isWinner={winner === matchup.team1} />
                            </div>
                            <div className={`transition-all duration-300 ${winner === matchup.team2 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team2} isWinner={winner === matchup.team2} />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-32">
                            <button
                              onClick={() => setEastFinal(matchup.team1)}
                              className="text-sm mb-1 w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team1} />
                            </button>
                            <button
                              onClick={() => setEastFinal(matchup.team2)}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team2} />
                            </button>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    <div className="text-gray-500 text-center mt-32">Complete Round 2 first</div>
                  )}
                </div>

                {/* Conference Champion */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Champion</h3>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 border-2 border-blue-400 mt-32">
                    <div className="text-white font-bold text-center">
                      {eastFinal || 'TBD'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Western Conference */}
            <div className="bg-gradient-to-br from-red-900/20 to-slate-900/20 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <h2 className="text-4xl font-bold text-red-300 mb-8 text-center drop-shadow-lg">
                Western Conference 🏒
              </h2>
              
              <div className="grid grid-cols-4 gap-4">
                {/* Round 1 */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Round 1</h3>
                  {bracket.westMatchups.map((matchup, idx) => {
                    const winner = westRound1Winners[idx];
                    if (winner) {
                      return (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 shadow-lg">
                          <div className={`mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                            <TeamDisplay teamName={matchup.team1} isWinner={winner === matchup.team1} />
                          </div>
                          <div className={`transition-all duration-300 ${winner === matchup.team2 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                            <TeamDisplay teamName={matchup.team2} isWinner={winner === matchup.team2} />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 shadow-lg">
                          <button
                            onClick={() => setWestRound1Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team1; return newW; })}
                            className="text-sm mb-1 w-full text-left hover:bg-red-600/50 p-3 rounded-lg text-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                          >
                            <TeamDisplay teamName={matchup.team1} />
                          </button>
                          <button
                            onClick={() => setWestRound1Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                            className="text-sm w-full text-left hover:bg-red-600/50 p-3 rounded-lg text-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                          >
                            <TeamDisplay teamName={matchup.team2} />
                          </button>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* Round 2 */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Round 2</h3>
                  {westRound1Winners.every(w => w !== null) ? (
                    [
                      { team1: westRound1Winners[0], team2: westRound1Winners[1] },
                      { team1: westRound1Winners[2], team2: westRound1Winners[3] }
                    ].map((matchup, idx) => {
                      const winner = westRound2Winners[idx];
                      if (winner) {
                        return (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-12">
                            <div className={`mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team1} isWinner={winner === matchup.team1} />
                            </div>
                            <div className={`transition-all duration-300 ${winner === matchup.team2 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team2} isWinner={winner === matchup.team2} />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-12">
                            <button
                              onClick={() => setWestRound2Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team1; return newW; })}
                              className="text-sm mb-1 w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team1} />
                            </button>
                            <button
                              onClick={() => setWestRound2Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team2} />
                            </button>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="text-gray-500 text-center mt-12">Complete Round 1 first</div>
                  )}
                </div>

                {/* Conference Finals */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Conference Final</h3>
                  {westRound2Winners.every(w => w !== null) ? (
                    (() => {
                      const matchup = { team1: westRound2Winners[0], team2: westRound2Winners[1] };
                      const winner = westFinal;
                      if (winner) {
                        return (
                          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-32">
                            <div className={`mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team1} isWinner={winner === matchup.team1} />
                            </div>
                            <div className={`transition-all duration-300 ${winner === matchup.team2 ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse rounded p-1' : ''}`}>
                              <TeamDisplay teamName={matchup.team2} isWinner={winner === matchup.team2} />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600 mt-32">
                            <button
                              onClick={() => setWestFinal(matchup.team1)}
                              className="text-sm mb-1 w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team1} />
                            </button>
                            <button
                              onClick={() => setWestFinal(matchup.team2)}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              <TeamDisplay teamName={matchup.team2} />
                            </button>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    <div className="text-gray-500 text-center mt-32">Complete Round 2 first</div>
                  )}
                </div>

                {/* Conference Champion */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center mb-4">Champion</h3>
                  <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-4 border-2 border-red-400 mt-32">
                    <div className="text-white font-bold text-center">
                      {westFinal || 'TBD'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stanley Cup Final */}
            <div className="bg-gradient-to-r from-yellow-600/30 via-gold-500/20 to-yellow-600/30 rounded-3xl p-10 border-4 border-yellow-400/50 shadow-2xl backdrop-blur-lg">
              <h2 className="text-5xl font-bold text-yellow-300 mb-8 text-center drop-shadow-2xl animate-bounce">
                🏆 STANLEY CUP FINAL 🏆
              </h2>
              <div className="grid grid-cols-3 gap-8 items-center">
                <div className="bg-gradient-to-br from-blue-600/40 to-blue-800/40 rounded-xl p-8 text-center shadow-xl border border-blue-400/50">
                  <div className="text-sm text-blue-200 mb-3 font-semibold">Eastern Champion</div>
                  <div className={`text-2xl font-bold transition-all duration-500 ${champion === eastFinal ? 'text-yellow-300 scale-110 animate-pulse' : 'text-white'}`}>
                    {eastFinal ? <TeamDisplay teamName={eastFinal} /> : 'TBD'}
                  </div>
                </div>
                
                <div className="text-center text-yellow-300 text-3xl font-bold animate-pulse">
                  VS
                </div>
                
                <div className="bg-gradient-to-br from-red-600/40 to-red-800/40 rounded-xl p-8 text-center shadow-xl border border-red-400/50">
                  <div className="text-sm text-red-200 mb-3 font-semibold">Western Champion</div>
                  <div className={`text-2xl font-bold transition-all duration-500 ${champion === westFinal ? 'text-yellow-300 scale-110 animate-pulse' : 'text-white'}`}>
                    {westFinal ? <TeamDisplay teamName={westFinal} /> : 'TBD'}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <div className="text-yellow-200 text-lg mb-4 font-semibold">Stanley Cup Champion</div>
                {eastFinal && westFinal && !champion ? (
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => setChampion(eastFinal)}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                    >
                      <TeamDisplay teamName={eastFinal} />
                    </button>
                    <button
                      onClick={() => setChampion(westFinal)}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                    >
                      <TeamDisplay teamName={westFinal} />
                    </button>
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-yellow-300 drop-shadow-lg animate-bounce">
                    {champion ? <TeamDisplay teamName={champion} /> : 'TBD'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!bracket && (
          <div className="text-center text-white/60 mt-12">
            <p className="text-lg">Click the button above to generate a random playoff bracket!</p>
          </div>
        )}
      </div>
    </div>
  );
}
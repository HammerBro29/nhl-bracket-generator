import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

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
    'Utah Mammoth', 'Chicago Blackhawks'
  ],
  pacific: [
    'Vegas Golden Knights', 'Edmonton Oilers', 'Los Angeles Kings',
    'Vancouver Canucks', 'Seattle Kraken', 'Calgary Flames',
    'Anaheim Ducks', 'San Jose Sharks'
  ]
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
          <h1 className="text-5xl font-bold text-white mb-4">
            🏒 NHL Stanley Cup Playoff Bracket
          </h1>
          <button
            onClick={generateNewBracket}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all transform hover:scale-105"
          >
            <RefreshCw size={20} />
            Generate Random Bracket
          </button>
        </div>

        {/* Bracket Display */}
        {bracket && (
          <div className="space-y-8">
            {/* Eastern Conference */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-3xl font-bold text-blue-300 mb-6 text-center">
                Eastern Conference
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
                          <div className={`text-sm mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                            {matchup.seed1}: {matchup.team1}
                          </div>
                          <div className={`text-sm transition-all duration-300 ${winner === matchup.team2 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                            {matchup.seed2}: {matchup.team2}
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
                            {matchup.seed1}: {matchup.team1}
                          </button>
                          <button
                            onClick={() => setEastRound1Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                            className="text-sm w-full text-left hover:bg-blue-600/50 p-3 rounded-lg text-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                          >
                            {matchup.seed2}: {matchup.team2}
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
                            <div className={`text-sm mb-1 ${winner === matchup.team1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team1}
                            </div>
                            <div className={`text-sm ${winner === matchup.team2 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team2}
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
                              {matchup.team1}
                            </button>
                            <button
                              onClick={() => setEastRound2Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              {matchup.team2}
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
                            <div className={`text-sm mb-1 ${winner === matchup.team1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team1}
                            </div>
                            <div className={`text-sm ${winner === matchup.team2 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team2}
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
                              {matchup.team1}
                            </button>
                            <button
                              onClick={() => setEastFinal(matchup.team2)}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              {matchup.team2}
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-3xl font-bold text-red-300 mb-6 text-center">
                Western Conference
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
                          <div className={`text-sm mb-1 transition-all duration-300 ${winner === matchup.team1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                            {matchup.seed1}: {matchup.team1}
                          </div>
                          <div className={`text-sm transition-all duration-300 ${winner === matchup.team2 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                            {matchup.seed2}: {matchup.team2}
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
                            {matchup.seed1}: {matchup.team1}
                          </button>
                          <button
                            onClick={() => setWestRound1Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                            className="text-sm w-full text-left hover:bg-red-600/50 p-3 rounded-lg text-gray-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                          >
                            {matchup.seed2}: {matchup.team2}
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
                            <div className={`text-sm mb-1 ${winner === matchup.team1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team1}
                            </div>
                            <div className={`text-sm ${winner === matchup.team2 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team2}
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
                              {matchup.team1}
                            </button>
                            <button
                              onClick={() => setWestRound2Winners(prev => { const newW = [...prev]; newW[idx] = matchup.team2; return newW; })}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              {matchup.team2}
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
                            <div className={`text-sm mb-1 ${winner === matchup.team1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team1}
                            </div>
                            <div className={`text-sm ${winner === matchup.team2 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                              {matchup.team2}
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
                              {matchup.team1}
                            </button>
                            <button
                              onClick={() => setWestFinal(matchup.team2)}
                              className="text-sm w-full text-left hover:bg-slate-700 p-2 rounded text-gray-300"
                            >
                              {matchup.team2}
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
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-xl p-8 border-4 border-yellow-400">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">
                🏆 STANLEY CUP FINAL 🏆
              </h2>
              <div className="grid grid-cols-3 gap-8 items-center">
                <div className="bg-white/20 rounded-lg p-6 text-center">
                  <div className="text-sm text-yellow-200 mb-2">Eastern Champion</div>
                  <div className={`text-xl font-bold ${champion === eastFinal ? 'text-white' : 'text-gray-300'}`}>
                    {eastFinal || 'TBD'}
                  </div>
                </div>
                
                <div className="text-center text-white text-2xl font-bold">
                  VS
                </div>
                
                <div className="bg-white/20 rounded-lg p-6 text-center">
                  <div className="text-sm text-yellow-200 mb-2">Western Champion</div>
                  <div className={`text-xl font-bold ${champion === westFinal ? 'text-white' : 'text-gray-300'}`}>
                    {westFinal || 'TBD'}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <div className="text-yellow-200 text-lg mb-4 font-semibold">Stanley Cup Champion</div>
                {eastFinal && westFinal && !champion ? (
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => setChampion(eastFinal)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
                    >
                      {eastFinal}
                    </button>
                    <button
                      onClick={() => setChampion(westFinal)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
                    >
                      {westFinal}
                    </button>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white">
                    {champion || 'TBD'}
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
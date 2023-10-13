import data from "../dictionaries/outcomes.json"


module.exports = Object.keys(data).reduce((acc, key) => {
  
  const f = data[key];
  console.log(f);

  const selectionId = f.selectionId
  const marketId = f.marketId
  const gamePeriodId = f.gamePeriodId
  const gameTypeId = f.gameTypeId
  const gameVarietyId = f.gameVarietyId
  const pointsId = f.pointsId
  const teamPlayerId = f.teamPlayerId
  const _comment = f._comment

  acc[key] = {
    selectionId,
    marketId,
    gamePeriodId,
    gameTypeId,
    gameVarietyId,
    pointsId,
    teamPlayerId,
    _comment
  }
  
  return acc
}, {})

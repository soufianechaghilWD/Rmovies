const { CreateNewMtv } = require("../../model/mtv");
const { SetSuggMtvStatus, GetASuggMtv } = require("../../model/suggestionMtv");

module.exports.ADsuggMtv = async (suggMtvId, newStatus) => {
  // set the new value
  const done = await SetSuggMtvStatus(suggMtvId, newStatus);
  if (done.message)
    throw {
      status: 400,
      message: done.message || "Could not set the sugg status",
    };

  // add the sugg mtv to the mtvs
  if (newStatus !== "aproved") return { done: true };

  const suggMtv = await GetASuggMtv(suggMtvId);
  if (suggMtv.message)
    throw {
      status: 400,
      message: "Could not add the mtv after setting it to approved",
    };
  const data = {
    name: suggMtv.suggmtv.name,
    gendar: suggMtv.suggmtv.gendar,
    description: suggMtv.suggmtv.description,
    picture: suggMtv.suggmtv.picture,
    type: suggMtv.suggmtv.type,
    rate: suggMtv.suggmtv.rate,
    length: suggMtv.suggmtv.length,
    seasons: suggMtv.suggmtv.seasons,
    episodes: suggMtv.suggmtv.episodes,
  };
  const mtv = await CreateNewMtv(data);
  if (mtv.message)
    throw {
      status: 400,
      message: "Could not add the mtv after setting it to approved",
    };

  return { id: mtv.id, done: true };
};

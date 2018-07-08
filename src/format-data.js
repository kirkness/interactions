const formatData = playlists => {
  // TODO: Refactor to use lodash
  const clonedData = [...playlists];
  const tracksGrid = [];
  while (clonedData.some(playlist => playlist.tracks.length)) {
    tracksGrid.push([
      clonedData[0].tracks.pop() || null,
      clonedData[1].tracks.pop() || null,
      clonedData[2].tracks.pop() || null
    ]);
  }
  return tracksGrid;
};

export default formatData;

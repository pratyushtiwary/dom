function setIntersection(set1, set2) {
  const set2Array = [...set2];

  const intersectionSet = new Set();

  for (const set2Item of set2Array) {
    if (set1.has(set2Item)) {
      intersectionSet.add(set2Item);
    }
  }

  return intersectionSet;
}

module.exports = {
  setIntersection,
};
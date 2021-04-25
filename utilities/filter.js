const lastUniqueBy = (arr, prop) => {
  return arr.reduceRight((accumulator, current) => {
    if (!accumulator.some(x => x[prop] === current[prop])) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
};

module.exports = lastUniqueBy;

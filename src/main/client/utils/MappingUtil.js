import _ from "underscore";

export function filterTables(searchText, tables) {
  if (searchText.length < 3) {
    return [];
  }

  const searchTextInLowerCase = searchText.toLowerCase();
  return tables.filter(
    tableName => tableName.toLowerCase().includes(searchTextInLowerCase)
  );
}

export function filterOptions(searchText, options, key = "displayName") {
  // if (searchText.length < 1) {
  //   return [];
  // }
  const searchTextInLowerCase = searchText.toLowerCase();
  return options.filter((option) => {
    const optionValue = _.get(option, key);
    return optionValue.toLowerCase().includes(searchTextInLowerCase);
  });
}

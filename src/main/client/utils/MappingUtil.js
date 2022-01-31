export function filterTables(searchText, tables) {

    if (searchText.length < 3) {
        return [];
    }

    let searchTextInLowerCase = searchText.toLowerCase();
    return tables.filter(
        tableName => tableName.toLowerCase().includes(searchTextInLowerCase)
    );
}

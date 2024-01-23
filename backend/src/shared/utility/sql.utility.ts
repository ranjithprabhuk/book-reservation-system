export class SqlUtility {
  static getSearchTextWhereClause(repoName: string, columns: string[]) {
    let whereClause = '';

    for (let index = 0; index < columns.length; index++) {
      whereClause += `${repoName}.${columns[index]} LIKE :searchText `;

      if (index !== columns.length - 1) {
        whereClause += 'OR ';
      }
    }

    return '(' + whereClause + ') AND ';
  }
}

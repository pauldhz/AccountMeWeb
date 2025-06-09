export class CsvUtils {
  public static getContent(fileContent: string, separator: string): Map<string, string[]> {
    const csvMap = new Map();
    const headers= fileContent.split("\n")[0].split(separator)
      .map(title => title.replace("\r", ""));
    const content = fileContent.split("\n");
    const matrice = content.map(row => row.split(";"))
    matrice.shift();
    const matriceTransposed = this.transpose(matrice);
    let i= 0;
    headers.forEach(header => {
      csvMap.set(header, matriceTransposed[i]);
      i++;
    });
    return csvMap;
  }

  private static transpose(matrice: string[][]): string[][] {
    return matrice[0].map((_, colIndex) => matrice.map(row => row[colIndex]));
  }
}

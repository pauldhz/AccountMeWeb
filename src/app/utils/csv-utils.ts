export class CsvUtils {
  public static getHeader(fileContent: string, separator: string): string[] {
    return fileContent.split("\n")[0].split(separator)
      .map(title => title.replace("\r", ""));

  }
}

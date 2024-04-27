import { Parameter } from "./Parameter";

export class DateParam extends Parameter {
  constructor(name: string) {
    super(name);
  }

  public static register(): DateParam {
    return new DateParam("PARAM_DATE");
  }

  public populate(content: string, args?: any): string {
    content = super.populate(content, args);

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const yearFull = currentDate.getFullYear().toString();
    const yearShort = yearFull.slice(-2);

    content = content.replace(/(?<!D)DD(?!D)/, day)
    .replace(/(?<!M)MM(?!M)/, month)
    .replace(/YYYY/g, yearFull)
    .replace(/YY/g, yearShort);

    return content;
  }
}
import { DateParam } from "../params/DateParam";
import { FilenameParam } from "../params/FilenameParam";
import { Parameter } from "../params/Parameter";

interface IParameterManager {
  populate(content: string, args?: any): string | undefined;
}

export class ParameterManager implements IParameterManager {
  public static shared: ParameterManager | undefined;
  private _parameters: Parameter[] = [];

  constructor() {
    this._parameters.push(
      DateParam.register(),
      FilenameParam.register()
    );
  }

  public static registerParams() {
    if (!this.shared) {
      this.shared = new ParameterManager();
    }
  }

  public populate(content: string | undefined, args?: any): string | undefined {
    if (content === undefined) {
      return content;
    }

    this._parameters.forEach(param => {
      content = content?.replace(/{([^{}]*)}/g, (_, p1) => {
        const replaced = param.populate(p1, args);
        return `{${replaced}}`;
      });
    });

    content = content.replace(/\{([^}]*)\}/g, "$1");

    return content;
  }
}
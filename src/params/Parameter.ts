interface IParameter {
  populate(content: string, args?: any): string;
}

export class Parameter implements IParameter {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public static register(name: string): Parameter {
    return new Parameter(name);
  }

  public populate(content: string, args?: any) {
    return content;
  }
}
export interface AdditionalField {
  key: string;
  label: string;
}

export interface Group {
  // Fields of the group
  fields: string[];
  additionalField?: AdditionalField;
}

export class GroupBuilder {

  private groups: Group[] = [];
  private currentGroup: Group | null = null;

  public init() {
    this.groups = [];
    this.currentGroup = null;
    return this;
  }

  public addGroup(element: string) {
    if (this.currentGroup !== null) {
      this.groups.push(this.currentGroup);
    }
    this.currentGroup = {fields: [element]};
    return this;
  }


  public addElement(name: string) {
    if (this.currentGroup !== null) {
      this.currentGroup.fields.push(name);
    }
    return this;
  }

  public addAdditionalField(additionalField: AdditionalField) {
    if(this.currentGroup !== null) {
      this.currentGroup.additionalField = additionalField;
    }
    return this;
  }

  public build() {
    if(this.currentGroup !== null) {
      this.groups.push(this.currentGroup);
    }
    return this.groups;
  }
}

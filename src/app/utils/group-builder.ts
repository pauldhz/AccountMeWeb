

export interface Group {
  fields: string[];
}

export class GroupBuilder {

  private groups: Group[] = [];
  private currentGroup: Group | null = null;

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

  public build() {
    if(this.currentGroup !== null) {
      this.groups.push(this.currentGroup);
    }
    return this.groups;
  }
}

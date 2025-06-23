import {group} from '@angular/animations';

export interface AdditionalField {
  key: string;
  label: string;
}

export interface Proposition {
  fields: string[];
  label: string;
}

export interface Group {
  name?: string;
  selectedProposition: Proposition | undefined;
  propositions: Proposition[];
  additionalField?: AdditionalField;
}

export class GroupBuilder {
  private groups: Group[] = [];
  private currentGroup: Group | null = null;
  private currentProposition: Proposition | null = null;
  private uniqueProps: Set<Proposition> = new Set();

  public init(): this {
    this.groups = [];
    this.currentGroup = null;
    this.currentProposition = null;
    this.uniqueProps.clear();
    return this;
  }

  public addGroup(name?: string): this {
    this.pushCurrent();
    this.currentGroup = { name: name, propositions: [], selectedProposition: undefined };
    this.currentProposition = null;
    return this;
  }

  public addProposition(label: string): this {
    if (!this.currentGroup) {
      throw new Error('No group initialized. Call addGroup() first.');
    }
    this.pushCurrentProposition();

    this.currentProposition = {
      label,
      fields: []
    };

    return this;
  }

  public addGroupUniqueProposition(field: string): this {
    this.pushCurrent();

    this.currentGroup = { propositions: [], selectedProposition: undefined };
    this.currentProposition = {
      label: field,
      fields: [field]
    };
    this.uniqueProps.add(this.currentProposition);

    return this;
  }

  public addField(field: string): this {
    if (!this.currentProposition) {
      throw new Error('No proposition initialized. Call addProposition() or addUniqueProposition() first.');
    }
    this.currentProposition.fields.push(field);
    return this;
  }

  public addAdditionalField(additionalField: AdditionalField): this {
    if (!this.currentGroup) {
      throw new Error('No group initialized.');
    }
    this.currentGroup.additionalField = additionalField;
    return this;
  }

  public build(): Group[] {
    this.pushCurrent();
    return this.groups;
  }

  private pushCurrentProposition() {
    if (this.currentProposition && this.currentGroup) {
      this.currentGroup.selectedProposition = this.currentGroup.propositions[0];
      this.currentGroup.propositions.push(this.currentProposition);
      this.currentProposition = null;
    }
  }

  private pushCurrent() {
    this.pushCurrentProposition();
    if (this.currentGroup) {
      this.groups.push(this.currentGroup);
      this.currentGroup = null;
    }
  }
}

export function getPropositionsFields(groups: Group[], groupName: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  groups.find(group => group.name === groupName)?.propositions.forEach((proposition) => {
    map.set(proposition.label, proposition.fields);
  });
  return map;
}


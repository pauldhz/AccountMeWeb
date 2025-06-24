/**
 * The goal of the group builder is to propose something clear for the csv import form with mapping.
 * Group : A group of propositions.
 * Proposition : A set of fields :
 *  - If there are multiple propositions, a select with the propositions should be proposed.
 *  - When a proposition is selected, its fields are displayed
 * Field : A string to be proposed in import for mapping.
 */

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

  public addGroup(name?: string): this {
    this.pushCurrent();
    this.currentGroup = {name: name, propositions: [], selectedProposition: undefined};
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

    this.currentGroup = {propositions: [], selectedProposition: undefined};
    this.currentProposition = {
      label: field,
      fields: [field]
    };

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

  public addPropositionUniqueField(propositionLabel: string): this {
    if (!this.currentGroup) {
      throw new Error('No group initialized. Call addGroup() first.');
    }

    if (!this.currentGroup.name) {
      throw new Error('Cannot add a proposition with a field named after the group without setting group name. Use setGroupName().');
    }

    const fieldName = this.currentGroup.name;

    const prop: Proposition = {
      label: propositionLabel,
      fields: [fieldName]
    };

    this.currentGroup.propositions.push(prop);

    return this;
  }
}


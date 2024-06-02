export type NewCity = {
  name: string;
  codeInsee: number | null;
  departement: string;
};

export type ExistingCity = NewCity & {
  id: string;
};

export interface ICitiesEntity {
  city: ExistingCity;
  setId(): string;
  setCodeInsee(): number;
  getCities(): ExistingCity;
}

export class CitiesEntity implements ICitiesEntity {
  city: ExistingCity;

  constructor(city: ExistingCity) {
    this.city = city;
  }

  setId(): string {
    throw new Error("Method not implemented.");
  }

  setCodeInsee(): number {
    if (this.city.codeInsee) {
      return this.city.codeInsee;
    }
    return 0;
  }
  getCities(): ExistingCity {
    return {
      id: this.city.id,
      name: this.city.name.toLowerCase(),
      codeInsee: this.city.codeInsee,
      departement: this.city.departement.toLowerCase(),
    };
  }
}

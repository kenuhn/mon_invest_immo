import { NewCity } from "./entity";
export type CitiesApiTypes = {
  nom: string;
  code: string;
  departement: {
    code: string;
    nom: string;
  };
};

export interface ICitiesDTO {
  name: string;
  codeInsee: number;
  departement: { code: string; nom: string };
  getCity(): NewCity;
}
export type CitiesGetNameDTO = {
  name: string;
  id: string;
};

export class CitiesDTO implements ICitiesDTO {
  name: string;
  codeInsee: number;
  departement: { code: string; nom: string };

  constructor(citys: CitiesApiTypes) {
    this.name = citys.nom;
    this.codeInsee = Number(citys.code);
    this.departement = citys.departement;
  }

  getCity(): NewCity {
    return {
      name: this.name,
      codeInsee: this.codeInsee,
      departement: this.departement.nom,
    };
  }
}

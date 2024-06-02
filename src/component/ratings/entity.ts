import { IIdGenerator } from "../../utils/services/idGenerator";

export type NewRating = {
  postId: string;
  rentaLocative: number;
  dispo: number;
  coPropriete: number;
  tentionLocative: number;
  moyenne: number;
};

export type ExistingRating = NewRating & {
  id: string;
};

export interface IRatingEntity {
  rating: NewRating;
  setMoyenne(): number;
}

export class RatingEntity implements IRatingEntity {
  rating: NewRating;
  idGenerator: IIdGenerator;

  constructor(rating: NewRating, idGenerator: IIdGenerator) {
    this.rating = rating;
    this.idGenerator = idGenerator;
    this.rating.postId = rating.postId;
    this.rating.rentaLocative = rating.rentaLocative;
    this.rating.dispo = rating.dispo;
    this.rating.coPropriete = rating.coPropriete;
    this.rating.tentionLocative = rating.tentionLocative;
    this.rating.moyenne = this.setMoyenne();
  }

  setMoyenne(): number {
    const sum =
      this.rating.rentaLocative +
      this.rating.dispo +
      this.rating.coPropriete +
      this.rating.tentionLocative;
    return sum / 4;
  }
  setId() {
    return this.idGenerator.generate();
  }

  getRating(): ExistingRating {
    return { ...this.rating, id: this.setId() };
  }
}

export interface Recipe {
  calories: number;
  cautions: [string];
  dietLabels: [string];
  directions: [string];
  healthLabels: [string];
  image: string;
  ingredients: [string];
  label: string;
  url: string;
  _id: string;
  user_uploaded: boolean;
  source: IUser;
  date: Date;
  likes: [string];
  color?: string;
}

export interface IUser {
  uid: string;
  displayName: string;
}

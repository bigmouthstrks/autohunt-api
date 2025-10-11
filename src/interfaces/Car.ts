import Brand from "./Brand";
import Model from "./Model";

export default interface Car {
  id: number;
  brand: Brand;
  model: Model;
  year: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

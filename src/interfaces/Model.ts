export default interface Model {
  id: number;
  name: string;
  year: number;
  cylinderCapacity: number;
  transmission: string;
  horsePower: number;
  fuelType: FuelType;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

enum FuelType {
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
  OTHER = "OTHER",
}

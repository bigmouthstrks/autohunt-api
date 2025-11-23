export default interface Maintenance {
  id: number;
  title: string;
  description?: string;
  type: "REPAIR" | "MAINTENANCE" | "PART_CHANGE";
  date: Date;
  workshop: {
    id: number;
    name: string;
    address: string;
  };
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}


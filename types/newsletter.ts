import { Property } from "./property";

export interface Newsletter {
  id: string;
  title: string;
  content: string;
  category: string;
  readingTime: number;
  coverImage: string;
  propertyIds?: string[];
  properties?: Property[];
  createdAt: string;
  updatedAt: string;
}

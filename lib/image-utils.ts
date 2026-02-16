import { Property } from "@/types/property";

export const getImageIndex = (property: Property, targetImageUrl: string): number => {
  if (property.image === targetImageUrl) {
    return 0;
  }

  let index = 1;
  if (property.imageSections) {
    for (const section of property.imageSections) {
      for (const img of section.images) {
        if (img === targetImageUrl) {
          return index;
        }
        index++;
      }
    }
  }

  return 0;
};

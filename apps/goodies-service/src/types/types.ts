export interface Goodies {
  title: string;
  description: string;
  types: string;
  variants: [Variant];
  images: [File];
}

interface Variant {
  title: string;
  description: string;
  points: string;
  images: File;
}

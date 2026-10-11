// Origen de cada foto de /public/fotos. Pexels y Unsplash no exigen atribución, pero la dejamos igual.
export type PhotoCredit = {
  file: string;
  subject: string;
  source: "Pexels" | "Unsplash" | "Wikimedia Commons";
  author?: string;
  license: string;
  url: string;
};

export const PHOTO_CREDITS: PhotoCredit[] = [];

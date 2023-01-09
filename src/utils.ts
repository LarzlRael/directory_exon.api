export const imageFileFilter = (res, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const verifyValidId = (id: string): boolean => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else {
    return false;
  }
};

export const swapArrayElements = (
  arr: string[],
  indexA: number,
  indexB: number,
): string[] => {
  const temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
  return arr;
};

export enum departamentEnum {
  'La Paz' = 'La Paz',
  'Cochabamba' = 'Cochabamba',
  'Chuquisaca' = 'Chuquisaca',
  'Tarija' = 'Tarija',
  'Oruro' = 'Oruro',
  'Potosi' = 'Potosi',
  'Santa Cruz' = 'Santa Cruz',
  'Beni' = 'Beni',
  'Pando' = 'Pando',
}

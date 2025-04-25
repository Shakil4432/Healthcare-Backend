const pick = <T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: K[]
): Partial<T> => {
  const pickedObject: Partial<T> = {};
  for (const key of keys) {
    if (object && Object.hasOwnProperty.call(object, key)) {
      pickedObject[key] = object[key];
    }
  }

  return pickedObject;
};

export default pick;

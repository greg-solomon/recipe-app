interface ReducerTypes {
  type: string;
  value: string;
}

export default (arr: string[], { type, value }: ReducerTypes) => {
  switch (type) {
    case "add":
      return [...arr, value];
    case "remove":
      return arr.filter((_) => _ !== value);
    default:
      return arr;
  }
};

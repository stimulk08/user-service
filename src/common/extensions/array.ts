export function getIntersection<T>(a: Array<T>, b: Array<T>) {
    const set1 = new Set(a);
    const set2 = new Set(b);
  
    const intersection = [...set1].filter(
      element => set2.has(element)
    );
  
    return intersection;
  }
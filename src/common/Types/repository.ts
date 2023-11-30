
export class Repository<K, M> {
    findById: (id: K) => Promise<M | any>;
    create: (model: M | any) => Promise<M>;
    findByIdAndRemove: (id: K) => Promise<M | any>;
    findByIdAndUpdate: (
      id: K,
      data: Record<keyof M, any> | any,
    ) => Promise<M | any>;
    findAll: (limit?: number) => Promise<M[]>;
  }
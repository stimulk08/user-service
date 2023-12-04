import { TableField } from "./table-field";

export class PrimaryKey {
    partition: TableField[];
    claster: TableField[];
}

export const primaryKeyToString = (
    primaryKey: PrimaryKey
) => {
    const clasterEmpty = !primaryKey.claster.length;
    console.log(clasterEmpty);
    return  `PRIMARY KEY (${!clasterEmpty ? '(' : ''}${primaryKey.partition.map(f => f.name).join(',')})${primaryKey.claster.length ? ',' : ''} ${primaryKey.claster.map(f => f.name).join(',')}${!clasterEmpty ? ')' : ''}`;
}
export class TableField {
    name: string;
    type: string;
 }

 export const fieldToString = (field: TableField) => {
    return `${field.name} ${field.type}`;
 };
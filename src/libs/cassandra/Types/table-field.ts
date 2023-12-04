export class TableField {
    name: string;
    type: string;
 }

 export const fieldToString = (field: TableField) => {
    console.log(field);
    return `${field.name} ${field.type}`;
 };

export const operatorns = ['=', '<', '>', '<=', '>=', '!=', 'IN', 'NOT IN'] as const;
export type Operator = typeof operatorns[number];
export class QueryParam {
    operator: Operator;
    value: any;
}
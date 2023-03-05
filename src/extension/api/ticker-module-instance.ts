export interface TickerModuleInstance<Data> {
    id: string;
    moduleId: string;
    name: string;
    description: string;
    data?: Data;
}
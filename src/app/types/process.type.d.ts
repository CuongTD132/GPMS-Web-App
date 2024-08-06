type Process = {
    id: string;
    code: string;
    name: string;
    orderNumber: number;
    description?: string;
    productionProcessSteps: ProductionProcessSteps[];
};

type ProductionProcessSteps = {
    id: string;
    code: string;
    name: string;
    orderNumber: number;
    standardTime: number;
    outputPerHour: number;
    description?: string;
    productionProcessStepIOs: ProductionProcessStepIOs[];
};

type ProductionProcessStepIOs = {
    id: string;
    quantity?: number;
    consumption?: number;
    isProduct: boolean;
    type: string;
    semiFinishedProductCode?: string;
    semiFinishedProductName?: string;
    materialCode?: string;
    materialName?: string;
};

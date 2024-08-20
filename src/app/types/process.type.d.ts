type Process = {
    id: string;
    code: string;
    name: string;
    orderNumber: number;
    description?: string;
    steps: Step[];
};

type Step = {
    id: string;
    code: string;
    name: string;
    orderNumber: number;
    standardTime: number;
    outputPerHour: number;
    description?: string;
    stepIOs: StepIO[];
};

type StepDetail = {
    id: string;
    code: string;
    name: string;
    orderNumber: number;
    standardTime: number;
    outputPerHour: number;
    description?: string;
    materials: StepIO[];
    semiFinishedProducts: StepIO[];
    products: StepIO[];
};

type StepIO = {
    id: string;
    quantity?: number;
    consumption?: number;
    isProduct: boolean;
    type: string;
    semiFinishedProductCode?: string;
    semiFinishedProductName?: string;
    materialCode?: string;
    materialName?: string;
    productName?: string;
    productCode?: string;
};

type CreateStepIO = {
    quantity?: number;
    consumption?: number;
    isProduct: boolean;
    type?: string;
    semiFinishedProductCode?: string;
    materialId?: string;
};

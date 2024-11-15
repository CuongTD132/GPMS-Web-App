type Product = {
    id: string;
    code: string;
    name: string;
    description?: string;
    imageURLs?: string[];
    sizes: string[];
    category: Category;
    colorCodes: string[];
    createdDate: string;
    status: string;
    semiFinishedProducts: SemiFinishedProduct[];
    specifications: Specification[];
    productionProcesses: Process[];
};

type CreateProduct = {
    code: string;
    name: string;
    description: string;
    categoryId: string;
    semiFinishedProducts: SemiFinishedProduct[];
    specifications: {
        size: string;
        color: string;
        measurements: Measurements[];
        boMs: {
            sizeWidth: number;
        };
        qualityStandards: QualityStandardsNew[];
    }[];
    processes: {
        code: string;
        name: string;
        orderNumber: number;
        description: string;
        steps: Steps[];
    };
};

type Measurements = {
    name: string;
    measure: number;
    unit: string;
};

type QualityStandardsNew = {
    name: string;
    description: string;
    images: string[];
    materialId: string;
};

type StepIOs = {
    quantity: number;
    consumption: number;
    isProduct: boolean;
    type: string;
    materialId: string;
    semiFinishedProductCode: string;
};

type Steps = {
    code: string;
    name: string;
    orderNumber: number;
    standardTime: number;
    outputPerHour: number;
    description: string;
    stepIOs: StepIOs[];
};

type IORespone = {
    stepId?: string;
    seriesQuantity: number;
    inputs: Res;
    outputs: Res;
};

type Res = {
    products: GeneralIO[];
    semis: GeneralIO[];
    materials: GeneralIO[];
};
type GeneralIO = {
    id: string;
    code: string;
    name: string;
    quantity?: number;
    consumption?: number;
    unit: string;
    type: string;
    isQuantity: boolean;
    totalQuantity?: number;
    totalConsumption?: number;
    resultQuantity?: number;
    resultConsumption?: number;
};

type InputOutputResult = {
    stepInputOutputId: string;
    consumption?: number;
    quantity?: number;
};

type ProductInput = {
    code: string,
    name: string,
    description?: string,
    categoryId: string,
    semiFinishedProducts: SemiFinishedProductInput[],
    specifications: SpecificationInput[],
    
}


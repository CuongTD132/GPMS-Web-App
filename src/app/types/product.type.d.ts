type Product = {
    id: string;
    code: string;
    name: string;
    description?: string;
    imageURLs?: string[];
    sizes: string[];
    category: Category;
    colors: string[];
    createdDate: string;
    status: string;
    semiFinishedProducts: SemiFinishedProduct[];
    specifications: Specification[];
    productionProcesses: Process[];
};

type CreateProduct = {
    code: string;
    name: string;
    sizes: string;
    colors: string;
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

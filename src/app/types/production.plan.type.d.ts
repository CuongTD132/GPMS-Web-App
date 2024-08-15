type ProductionPlan = {
    parentProductionPlan?: Plan;
    childProductionPlans?: Plan[];
    productionRequirements: ProductionRequirement[];
} & Plan;

type Plan = {
    id: string;
    code: string;
    name: string;
    description: string;
    expectedStartingDate: string;
    dueDate: string;
    actualStartingDate?: string;
    completionDate?: string;
    type: string;
    createdDate: string;
    status: string;
    creatorName: string;
    reviewerName: string;
};

type ProductionRequirement = {
    id: string;
    quantity: number;
    productSpecification: Specification;
    productionEstimations: ProductionEstimation[];
};

type ProductionEstimation = {
    id: string;
    quantity: number;
    overtimeQuantity: number;
    quarter: string;
    month: string;
    batch: number;
    dayNumber?: number;
    productionSeries: ProductionSeries[];
};
type ProductionSeries = {
    id: string;
    code: string;
    quantity: number;
    faultyQuantity: number;
    currentProcess: string;
    status: string;
};

type MonthAndSpecs = {
    month: string;
    requirements: Reqs[];
};

type BatchAndSpecs = {
    batch: number;
    requirements: Reqs[];
};

type Reqs = {
    productName: string;
    specificationId: string;
    quantity: number;
    size: string;
    color: string;
};

type Series = {
    code: string;
    quantity: number;
};

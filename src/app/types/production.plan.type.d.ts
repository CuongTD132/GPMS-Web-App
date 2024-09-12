type ProductionPlan = {
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
    childPlanRequiredCount: number;
    batch?: number;
    type: string;
    createdDate: string;
    status: string;
    creatorName: string;
    reviewerName: string;
    readyToFinish?: boolean;
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
    faultyQuantity?: number;
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

type BatchReqs = {
    quantity: number;
    overTimeQuantity: number;
    dayNumber: number;
    productionSeries: Series[];
};

type Series = {
    code: string;
    quantity: number;
};

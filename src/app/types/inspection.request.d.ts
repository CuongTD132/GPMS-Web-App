type InspectionRequest = {
    id: string;
    name: string;
    requiredQuantity: number;
    inspectedQuantity: number;
    failedQuantity: number;
    passedQuantity: number;
    createdDate: string;
    creator: {
        id: string;
        name: string;
        code: string;
    };
    productionSeries: {
        id: string;
        name?: string;
        code: string;
    };
    status: string;
};

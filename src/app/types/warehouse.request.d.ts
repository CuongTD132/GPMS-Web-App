type WarehouseRequest = {
    name: string;
    description: string;
    warehouseRequestRequirements: {
        producitonRequirementId: string;
        quantity: number;
    }[];
};

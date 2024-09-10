type WarehouseRequest = {
    id: string;
    creatorName: string;
    reviewerName?: string;
    name: string;
    status: string;
    createdDate: string;
    warehouseRequestRequirements: Req[];
};

type Req = {
    id: string;
    quantity: number;
    productName: string;
    productCode: string;
    size: string;
    color: string;
    warehouseTicket?: {
        id: string;
        name: string;
        createdDate: string;
        type: string;
        warehouseName: string;
    };
};

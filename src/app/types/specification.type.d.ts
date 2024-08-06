type Specification = {
    id: string;
    inventoryQuantity: number;
    size: string;
    color: string;
    productCode: string;
    productName: string;
    measurements: Measurement[];
    billOfMaterials: BillOfMaterials[];
    qualityStandards: QualityStandards[];
};

type BillOfMaterials = {
    id: string;
    sizeWidth: number;
    consumption: number;
    description?: string;
    material: Material;
};

type QualityStandards = {
    id: string;
    name: string;
    description?: string;
    imageURL?: string[];
};

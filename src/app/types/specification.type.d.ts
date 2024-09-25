type Specification = {
    id: string;
    inventoryQuantity: number;
    size: string;
    colorCode: string;
    imageURLs?: string;
    productCode: string;
    productName: string;
    measurements: Measurement[];
    billOfMaterials: BillOfMaterial[];
    qualityStandards: QualityStandards[];
};

type BillOfMaterial = {
    id: string;
    sizeWidth: number;
    consumption: number;
    description?: string;
    material: Material;
};

type NewBillOfMaterial = {
    materialId: string;
    sizeWidth: number;
    consumption: number;
    description?: string;
};

type QualityStandards = {
    id: string;
    materialName: string;
    materialId: string;
    name: string;
    description?: string;
    imageURL?: string[];
};

type NewSpecification = {
    size: string;
    color: string;
    measurements: Measurement[];
    billOfMaterial: BillOfMaterial[];
    qualityStandards: QualityStandards[];
};

// 
type SpecificationInput = {
    sizeName: string,
    colorCode: string,
    measurement: MeasurementInput[],
    boMs
}
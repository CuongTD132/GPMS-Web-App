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

type Account = {
    id: string;
    code: string;
    email: string;
    position: string;
    status: string;
};

type AccountInfo = {
    id: string;
    code: string;
    fullName: string;
    email: string;
    position: string;
    status: string;
    createdDate: string;
};

type NewAccount = {
    code: string;
    email: string;
    password: string;
    personalInfo: PersonalInfoProps;
};

type PersonalInfoProps = {
    fullName: string;
    position: number;
    departmentId?: string;
};

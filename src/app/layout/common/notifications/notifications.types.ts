// export interface Notification {
//     id: string;
//     icon?: string;
//     image?: string;
//     title?: string;
//     description?: string;
//     time: string;
//     link?: string;
//     useRouter?: boolean;
//     read: boolean;
// }

export interface Notification {
    id: string;
    title?: string;
    body?: string;
    createdDate: string;
    isRead?: boolean;
    // read: boolean;
}

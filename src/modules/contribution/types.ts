export interface UserCardProps {
    name: string;
    amount: number;
    currency?: string;
    status?: "SUCCESS" | "PENDING" | "FAILED";
    email: string;
    phone?: string;
    note?: string;
    createdAt?: string;
    onClick?: () => void;
}
export interface DefaultValue {
    name: string;
    gender: "Male" | "Female" | undefined;
    birth_date: string | null;
    birth_month: string | null;
    birth_year: string | null;
    deceased: boolean;
    death_date: string | null;
    death_month: string | null;
    death_year: string | null;
    phone_number: string;
    occupation: string;
    education: string;
    address: string;
    descendant: "Yes" | "No" | undefined;
    father: string;
    mother: string;
    siblings: string;
}

export interface FormError {
    name: string,
    gender: string,
    birth_date: string,
    birth_month: string,
    birth_year: string,
    death_year: string,
    death_month: string,
    death_date: string,
    descendant: string,
}
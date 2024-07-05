export interface BodyUserFindAllDto {
    page: number;
    limit: number;
    filter?: {
        start_date?: Date | string,
        end_date?: Date | string
    }
}
export interface ResponseUserFindAllDto {
    data: {
        user_internal_id: string;
        user_name: string;
        user_whatsapp_number: string;
        user_first_input: string;
        user_createdAt: string;
        user_updatedAt: string;
    }[]
    meta: {
        page: number
        limit: number
        count_total: number
        count: number
        filter: any
    }
}
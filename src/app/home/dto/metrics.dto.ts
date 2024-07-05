export interface BodyMetricsFindAllDto {
    start_date?: Date | string,
    end_date?: Date | string
}
export interface ResponseMetricsFindAllDto {
    count_access: number;
    day: number;
    month: string;
    year: number;
    date_sessions_created: string;
}
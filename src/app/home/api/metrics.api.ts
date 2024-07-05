import { apiClient } from "@/utils/axios";
import { BodyMetricsFindAllDto, ResponseMetricsFindAllDto } from "../dto/metrics.dto";

export class MetricsApi {
    private findAllUrl: string;

    constructor() {
        this.findAllUrl = 'metrics/list'
    }

    async findAll(body: BodyMetricsFindAllDto): Promise<ResponseMetricsFindAllDto[]> {
        try {
            const response = await apiClient.post(`${this.findAllUrl}`, body);
            return response.data;
        } catch (err) {
            throw new Error(`Cannot find logs: ${err}`)
        }
    }
}
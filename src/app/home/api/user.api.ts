import { apiClient } from "@/utils/axios";
import { BodyUserFindAllDto, ResponseUserFindAllDto } from "../dto/user.dto";

export class UserApi {
    private findAllUrl: string;

    constructor() {
        this.findAllUrl = 'user/list'
    }

    async findAll({ page = 0, limit = 5 }: BodyUserFindAllDto): Promise<ResponseUserFindAllDto> {
        try {

            const response = await apiClient.post(`${this.findAllUrl}`, {
                user: 'user',
                params: {
                    page,
                    limit
                }
            });
            return response.data;
        } catch (err) {
            throw new Error(`Cannot find logs: ${err}`)
        }
    }
}
'use client'
import { TableComponentDto } from "@/components/Table.component";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "../loading";
import { MetricsApi } from "./api/metrics.api";
import { UserApi } from "./api/user.api";

let columnsName: TableComponentDto[] = [
    {
        id: 'user_name',
        aling: 'center',
        title: 'Usuário',
    },
    {
        id: 'user_whatsapp_number',
        aling: 'center',
        title: 'Telefone',
        formatPhone: true
    },
    {
        id: 'user_first_input',
        aling: 'center',
        title: 'Mensagem',
    },
    {
        id: 'user_createdAt',
        aling: 'center',
        title: 'Data inicial',
        formatDate: true
    }
]
let apiHome: UserApi;
let apiMetrics: MetricsApi;

export default function HomePage() {
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const formatDateFilter = (date: Date) => {
        console.log('Passou', date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const handleFindMetrics = async () => {
        try {
            apiMetrics = new MetricsApi();
            startDate.setDate(startDate.getDate() - 7);

            const response = await apiMetrics.findAll({
                start_date: formatDateFilter(startDate),
                end_date: formatDateFilter(endDate)
            });
            return response;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }

    const {
        isLoading: isLoadingMetrics,
        isError: isErrorMetrics,
        data: dataListMetrics,
        refetch: refetchMetrics,
        isFetched: isFetchedMetrics
    } = useQuery({
        queryKey: [`find-all-metrics`, page, limit],
        queryFn: () => handleFindMetrics(),
        refetchOnWindowFocus: false,
        // retry: 3
    });

    // const handleFindLogsPharma = async () => {
    //     try {
    //         apiHome = new UserApi();
    //         const response = await apiHome.findAll({
    //             page: page,
    //             limit: limit
    //         });
    //         return response;
    //     } catch (err) {
    //         throw new Error(`Error: ${err}`)
    //     }
    // }

    // const {
    //     isLoading,
    //     isError,
    //     data: dataList,
    //     refetch,
    //     isFetched
    // } = useQuery({
    //     queryKey: [`find-all-epharma`, page, limit],
    //     queryFn: () => handleFindLogsPharma(),
    //     refetchOnWindowFocus: false,
    //     // retry: 3
    // });

    const handleChangePage = (page: number) => {
        setPage(page || 0);
    }

    const handleChangeLimit = (limit: number) => {
        setPage(page || 0);
        setLimit(limit || 5)
    }

    if (isLoadingMetrics) return (<Loading />)
    // if (isError) return (
    //     <div className="w-full h-52 flex justify-center items-center flex-col gap-4">
    //         <FontAwesomeIcon className="text-4xl" icon={faFaceMeh} />
    //         <div>
    //             Não foi possivel buscar os dados
    //         </div>

    //     </div>
    // )
    return (
        <>
            <div className="w-full p-4 grid grid-cols-3 gap-3">
                <span className="bg-gray-5  rounded-md p-4">
                    <h2 className="w-full text-center font-semibold border-b border-primary pb-2 text-xl">Acessos Semanais</h2>
                    <p className="w-full text-center p-2 text-lg font-medium">
                        {
                            dataListMetrics?.reduce((sum, item) => sum + item.count_access, 0)
                        }
                    </p>
                </span>
                <span className="bg-gray-5  rounded-md p-4">
                    <h2 className="w-full text-center font-semibold border-b border-primary pb-2 text-xl">
                        Últimos Acessos
                    </h2>
                    <p className="w-full text-center p-2 text-lg font-medium">
                        <span>
                            {
                                dataListMetrics ?
                                    (dataListMetrics[0]?.count_access || 0) > (dataListMetrics[1]?.count_access || 0) ?
                                        <KeyboardArrowUpIcon style={{ color: '#68F768' }} />
                                        : (dataListMetrics[0]?.count_access || 0) < (dataListMetrics[1]?.count_access || 0) ?
                                            <KeyboardArrowDownIcon style={{ color: '#FF0000' }} />
                                            : <HorizontalRuleIcon />
                                    : <HorizontalRuleIcon />

                            }
                        </span>
                        {
                            dataListMetrics ? dataListMetrics[0]?.count_access : 0
                        }
                    </p>
                </span>
                <span className="bg-gray-5  rounded-md p-4">
                    <h2 className="w-full text-center font-semibold border-b border-primary pb-2 text-xl">Acessos Semanais</h2>
                    <p className="w-full text-center p-2 text-lg font-medium">
                        {
                            dataListMetrics?.reduce((sum, item) => sum + item.count_access, 0)
                        }
                    </p>
                </span>
            </div>
            {/* <TableComponent
                listTableHeaders={columnsName}
                valuesObj={dataList?.data || []}
                page={page}
                limit={limit}
                length={dataList?.meta.count_total || 0}
                onChangePage={handleChangePage}
                onChangeLimit={handleChangeLimit}
            /> */}
        </>
    )
}
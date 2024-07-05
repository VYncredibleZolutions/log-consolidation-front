'use client'
import LineChart from "@/components/Chart.compontent";
import { TableComponent, TableComponentDto } from "@/components/Table.component";
import { faFaceMeh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClearIcon from '@mui/icons-material/Clear';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../loading";
import { MetricsApi } from "./api/metrics.api";
import { UserApi } from "./api/user.api";
import { BodyMetricsFindAllDto, ResponseMetricsFindAllDto } from "./dto/metrics.dto";

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
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [filter, setFilter] = useState<BodyMetricsFindAllDto>();
    const [filterInputs, setFilterInputs] = useState<BodyMetricsFindAllDto>();

    const onChange = (dates: any) => {
        const [start, end] = dates;

        setStartDate(start);
        setEndDate(end);
        setFilterInputs({
            start_date: start ? formatDateFilter(start) : '',
            end_date: end ? formatDateFilter(end) : ''
        });
    };

    const handleClearSearch = () => {
        const startDateAux = new Date();
        const endDateAux = new Date();

        startDateAux.setDate(startDateAux.getDate() - 7);
        setStartDate(startDateAux);
        setEndDate(endDateAux);

        setFilterInputs({
            start_date: startDateAux,
            end_date: endDateAux
        });

        setFilter({
            start_date: startDateAux,
            end_date: endDateAux
        });
    }

    const handleStopPropagation = (event: any) => {
        event.stopPropagation()
    }

    const handleChangeSearch = () => {
        if (filterInputs) {
            setFilter(filterInputs);
        }
    }

    const formatDateFilter = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const handleFindMetrics = async () => {
        try {
            apiMetrics = new MetricsApi();
            let bodyToFilter = filterInputs;
            if (!filterInputs) {
                bodyToFilter = {
                    start_date: startDate,
                    end_date: endDate
                }
            }

            const response = await apiMetrics.findAll(bodyToFilter || {});
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
        isFetching: isFetchingMetrics
    } = useQuery({
        queryKey: [`find-all-metrics`, filter],
        queryFn: () => handleFindMetrics(),
        refetchOnWindowFocus: false,
        // retry: 3
    });

    const handleFindLogsUser = async () => {
        try {
            apiHome = new UserApi();
            const response = await apiHome.findAll({
                page: page,
                limit: limit
            });
            return response;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }

    const {
        isLoading,
        isError,
        data: dataList,
        refetch,
        isFetching
    } = useQuery({
        queryKey: [`find-all-users`, page, limit],
        queryFn: () => handleFindLogsUser(),
        refetchOnWindowFocus: false,
        // retry: 3
    });

    const handleChangePage = (page: number) => {
        setPage(page || 0);
    }

    const handleChangeLimit = (limit: number) => {
        setPage(page || 0);
        setLimit(limit || 5)
    }

    if (isLoadingMetrics || isLoading || isFetching || isFetchingMetrics) return (<Loading />)
    return (
        <div className="p-4 flex gap-4 flex-col">
            {

                isErrorMetrics ?
                    <div className="w-full h-52 flex justify-center items-center flex-col gap-4 bg-gray-6 rounded-md">
                        <FontAwesomeIcon className="text-4xl" icon={faFaceMeh} />
                        <div>
                            Não foi possivel buscar os dados
                        </div>

                    </div>
                    :
                    <InformationsComponent dataListMetrics={dataListMetrics} key={`key-metrics-${filter?.start_date}-${filter?.end_date}`} />
            }
            <div className="w-full flex flex-col gap-4">
                <div className="bg-gray-6 rounded-md p-4 w-full flex justify-between items-center">
                    <DatePicker
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        dateFormat="dd/MM/yyyy"
                        className="bg-transparent border border-solid border-gray-input rounded p-3 w-full h-14 focus-visible:!border-yellow-becaps"
                        placeholderText="Select a range date"
                    />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(event) => {
                                handleStopPropagation(event);
                                handleChangeSearch();
                            }}
                            className="bg-primary p-2 rounded-md hover:bg-second text-black">
                            <SearchIcon />
                        </button>
                        <button
                            onClick={(event) => {
                                handleStopPropagation(event);
                                handleClearSearch();
                            }}
                            className="bg-primary p-2 rounded-md hover:bg-second text-black">
                            <ClearIcon />
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    {
                        isError ?
                            <div className="w-full h-52 flex justify-center items-center flex-col gap-4 bg-gray-6 rounded-md">
                                <FontAwesomeIcon className="text-4xl" icon={faFaceMeh} />
                                <div>
                                    Não foi possivel buscar os dados
                                </div>

                            </div>
                            :
                            <TableComponent
                                listTableHeaders={columnsName}
                                valuesObj={dataList?.data || []}
                                page={page}
                                limit={limit}
                                length={dataList?.meta.count_total || 0}
                                onChangePage={handleChangePage}
                                onChangeLimit={handleChangeLimit}
                            />
                    }
                </div>
            </div>

        </div>
    )
}

function BarChartComponent({
    listLabel,
    listData
}: {
    listLabel: string[],
    listData: number[]
}) {
    const data = {
        labels: listLabel,
        datasets: [
            {
                data: listData,
                borderColor: '#68F768',
                backgroundColor: '#4BA84B',
                fill: true,
                tension: 0.5
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#FFFFFF',

                },
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    display: false,
                    color: '#808080'
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
            }
        }
    };

    return (
        <div className="w-full h-full p-2">
            <LineChart data={data} options={options} />
        </div>
    );
}

function InformationsComponent({ dataListMetrics }: { dataListMetrics?: ResponseMetricsFindAllDto[] }) {
    return (
        <div className="w-full flex gap-3">
            <span className="rounded-md grid grid-cols-3 w-full gap-2">
                <div className="w-full grid grid-cols-1 gap-2">
                    <div className="bg-gray-6 rounded-md p-4">
                        <h2 className="w-full text-center font-semibold border-b border-primary pb-2 text-xl">
                            Últimos Acessos
                        </h2>
                        <div className="flex justify-center items-center">
                            <div className=" text-center p-2 text-lg font-medium">
                                {
                                    dataListMetrics ? dataListMetrics[0]?.count_access : 0
                                }
                            </div>
                            <span className="flex items-center justify-center">
                                <div>
                                    {
                                        dataListMetrics && dataListMetrics.length > 2 ?
                                            (dataListMetrics[0]?.count_access || 0) > (dataListMetrics[1]?.count_access || 0) ?
                                                <KeyboardArrowUpIcon style={{ color: '#68F768' }} />
                                                : (dataListMetrics[0]?.count_access || 0) < (dataListMetrics[1]?.count_access || 0) ?
                                                    <KeyboardArrowDownIcon style={{ color: '#FF0000' }} />
                                                    : <HorizontalRuleIcon />
                                            : <HorizontalRuleIcon />
                                    }
                                </div>
                                <div
                                    className={
                                        `${dataListMetrics && dataListMetrics.length > 2 ?
                                            (dataListMetrics[0]?.count_access || 0) > (dataListMetrics[1]?.count_access || 0) ?
                                                'text-primary' :
                                                (dataListMetrics[0]?.count_access || 0) < (dataListMetrics[1]?.count_access || 0) ?
                                                    'text-[#FF0000]' : '' : ''
                                        }`
                                    }
                                >
                                    {
                                        dataListMetrics && dataListMetrics.length > 2 ? ((
                                            (
                                                dataListMetrics[0]?.count_access - dataListMetrics[1]?.count_access
                                            ) / dataListMetrics[1]?.count_access
                                        ) * 100).toFixed(1) : 0
                                    }%
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className="bg-gray-6 rounded-md p-4">
                        <h2 className="w-full text-center font-semibold border-b border-primary pb-2 text-xl">
                            Acessos totais
                        </h2>
                        <div className="w-full text-center p-2 text-lg font-medium">
                            {
                                dataListMetrics?.reduce((sum, item) => sum + item.count_access, 0)
                            }
                        </div>

                    </div>
                </div>
                {
                    dataListMetrics && dataListMetrics.length > 2 &&
                    <div className="bg-gray-6 w-full rounded-md p-2 col">
                        <BarChartComponent
                            listLabel={dataListMetrics ? dataListMetrics.map((item) => `${item.day.toString().padStart(2, '0')}/${item.month.toLowerCase().substring(0, 3)}/${item.year}`).reverse() : []}
                            listData={dataListMetrics ? dataListMetrics.map((item) => item.count_access).reverse() : []}
                        />
                    </div>
                }
            </span>
        </div>
    )
}
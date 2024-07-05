"use client";
import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import Link from "next/link";
import React from "react";
import { isArray } from "util";

export interface TableComponentDto {
    aling: 'center' | 'right' | 'inherit' | 'left' | 'justify';
    title: string;
    id: string | string[];
    formatDate?: boolean,
    formatPhone?: boolean,
    formatStatus?: boolean,
    link?: string;
    detail_id?: string
}

export function formatDate(date: string | Date): string {
    let formatDate: Date;
    if (typeof date === 'string') {
        if (!(new Date(date) instanceof Date && !isNaN(new Date(date) as any))) return '-'
        formatDate = new Date(date);
    } else {
        formatDate = date;
    }

    const day = String(formatDate.getDate()).padStart(2, '0');
    const month = String(formatDate.getMonth() + 1).padStart(2, '0');
    const year = formatDate.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatPhone(telefone: string) {
    const number = telefone.replace(/\D/g, '');
    const createRegex = /^(\d{2})(\d)(\d{4})(\d{4})$/;
    const result = number.replace(createRegex, '($1) $2$3-$4');

    return result;
}

function formatStatus(status: any[] | any) {
    if (isArray(status)) {
        const values = status.filter((val) => !val);
        if (values.length === 0) {
            return (
                <div className="w-full flex justify-center items-center">
                    <div className="h-4 w-4 bg-green-400 rounded-full">
                    </div>
                </div>
            )
        } else if (values.length === 1) {
            return (
                <div className="w-full flex justify-center items-center">
                    <div className="h-4 w-4 bg-yellow-400 rounded-full">
                    </div>
                </div>
            )
        } else {
            return (
                <div className="w-full flex justify-center items-center">
                    <div className="h-4 w-4 bg-red-400 rounded-full">
                    </div>
                </div>
            )
        }
    } else {
        if (!!status) {
            return (
                <div className="w-full flex justify-center items-center">
                    <div className="h-4 w-4 bg-green-400 rounded-full">
                    </div>
                </div>
            )
        } else {
            return (
                <div className="w-full flex justify-center items-center">
                    <div className="h-4 w-4 bg-red-400 rounded-full">
                    </div>
                </div>
            )
        }
    }
}

interface TableContainerDto {
    listTableHeaders: TableComponentDto[]
    valuesObj: any[]
    page?: number;
    limit?: number;
    length?: number;
    onChangePage?: any;
    onChangeLimit?: any;
}

export function TableComponent({ listTableHeaders, valuesObj, page = 0, limit = 5, onChangeLimit, onChangePage, length = 0 }: TableContainerDto) {
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(limit);
    const [pageTable, setPageTable] = React.useState<number>(page);

    const handleChangePage = (event: unknown, pageNumber: number) => {
        onChangePage(pageNumber);
        setPageTable(pageNumber)
    }
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeLimit(+event.target.value);
        onChangePage(0);
        setRowsPerPage(+event.target.value)
        setPageTable(0)
    }


    return (
        <Paper>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {
                                React.Children.toArray(
                                    listTableHeaders.map(val => {
                                        return (
                                            <TableCell
                                                align={val.aling}
                                            >
                                                {val.title || '-'}
                                            </TableCell>
                                        )
                                    })
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            React.Children.toArray(
                                valuesObj.map((row) => {
                                    return (
                                        <TableRow>
                                            {
                                                React.Children.toArray(
                                                    listTableHeaders.map(res => {
                                                        let value = typeof res.id == 'string' ? row[res.id] || '-' : '-';
                                                        let link = res['link'] || 'Details';
                                                        return (
                                                            <TableCell
                                                                align={res.aling}
                                                            >
                                                                {
                                                                    res.formatDate ?
                                                                        formatDate(value)
                                                                        :
                                                                        res.formatPhone ?
                                                                            formatPhone(value)
                                                                            :
                                                                            res.formatStatus ?
                                                                                formatStatus(typeof res.id !== 'string' ? res.id.map((id) => row[id]) : row[res.id])
                                                                                :
                                                                                res.id !== 'detail' ?
                                                                                    <>
                                                                                        {value}
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        {
                                                                                            link ?
                                                                                                <Link className="text-sky-500 hover:underline" href={{ pathname: link, query: { id: res?.detail_id ? row[res?.detail_id] : row['lp_internal_id'] } }} >
                                                                                                    Details
                                                                                                </Link>
                                                                                                :
                                                                                                'Detalis'
                                                                                        }
                                                                                    </>
                                                                }
                                                            </TableCell>
                                                        )
                                                    })
                                                )
                                            }
                                        </TableRow>
                                    )

                                })
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                labelRowsPerPage="Items per page"
                rowsPerPageOptions={[5, 10, 25, 100, 1000]}
                component="div"
                count={length || valuesObj.length || 0}
                rowsPerPage={rowsPerPage}
                page={pageTable}
                SelectProps={{ variant: 'standard', size: 'medium' }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className='relative'
            />
        </Paper>
    );
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {<KeyboardDoubleArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {<KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {<KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {<KeyboardDoubleArrowRight />}
            </IconButton>
        </Box>
    );
}

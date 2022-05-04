/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import _ from "underscore"
import { CSVLink } from 'react-csv';
import {Row, Col} from "reactstrap";
import {
	useTable,
	usePagination,
	useSortBy,
	useFilters,
	useGroupBy,
	useExpanded,
	useRowSelect,
	useGlobalFilter,
	useBlockLayout,
	useResizeColumns,
} from 'react-table';

function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter, Header } }) {
	// const count = preFilteredRows.length;

	return (
		<input
			className="form-control"
			id="primaryColor"
			style={{ height: '1.5rem', marginLeft: "10%", width: "80%" }}
			value={filterValue || ''}
			onChange={(e) => {
				setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
			}}
			placeholder={`${Header}`}
		/>
	);
}

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
	const count = preGlobalFilteredRows.length;

	return (
		<input
			className="form-control"
			id="primaryColor"
			style={{ height: '2.2rem', display: 'block', width: '100%' }}
			value={globalFilter || ''}
			onChange={(e) => {
				setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
			}}
			placeholder={`Filter ${count} records`}
		/>
	);
}

function filterGreaterThan(rows, id, filterValue) {
	return rows.filter((row) => {
		const rowValue = row.values[id];
		return rowValue >= filterValue;
	});
}

filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

function TableComponent(props) {

	const [data, SetData] = useState([])
	const [columns, SetColumns] = useState([])
	const [visible, SetVisible] = useState({ header: true, filter: true, footer: true })
	const [content, SetContent] = useState({})

	const skipResetRef = React.useRef(false)

	useEffect(() => {
		if (props.headers) {
			let input = props.headers.filter(x => x.active === true).map((entry, index) => {
				return {
					key: index,
					Header: entry.header,
					accessor: entry.name,
					aggregate: entry.name,
					resize: true,
					Aggregated: ({ value }) => `${value} Names`,
				}
			})
			SetColumns([{ Header: ' ', columns: input }])
		}
	}, [props.headers])

	const updateMyData = (rowIndex, columnId, value) => {
		skipResetRef.current = true
		SetData(old =>
			old.map((row, index) => {
				if (index === rowIndex) { return { ...row, [columnId]: value } }
				return row
			})
		)
	}

	React.useEffect(() => { if(props.options){SetVisible(props.options)} }, [props.options])

	React.useEffect(() => { SetData(props.data) }, [props.data])

	React.useEffect(() => { skipResetRef.current = false }, [data])

	const filterTypes = React.useMemo(
		() => ({
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
						: true;
				});
			}
		}), []
	);

	const defaultColumn = React.useMemo(
		() => ({
			minWidth: 50,
			maxWidth: 500,
			Filter: DefaultColumnFilter
		}),
		[]
	);

	const prepareData = (headers, data) => {
		let output = []
		if (headers && data) {
			let active = headers.filter(x => x.active == true).map(entry => { return entry.name })
			output = data.map((entry) => {
				let filtered = _.pick(entry, active)
				return filtered
			})
		}
		return output
	}

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		preGlobalFilteredRows,
		setGlobalFilter,
		state: {
			pageIndex,
			pageSize,
			globalFilter
		},
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			filterTypes,
			updateMyData,
			disableMultiSort: true,
		},
		useFilters,
		useGlobalFilter,
		useGroupBy,
		useSortBy,
		useExpanded,
		usePagination,
		useRowSelect,
		useBlockLayout,
		useResizeColumns
	);

	useEffect(() => { if (props.rows) { setPageSize(props.rows) } }, [props.rows])

	return (
		<table className="table" id="primaryColor" {...getTableProps()}>
			{visible.header && (
				<thead>
					<tr style={{ display: "inline-flex", width: "100%" }}>
						<th style={{ display: "inline-flex", width: "100%" }}>
							<GlobalFilter
								preGlobalFilteredRows={preGlobalFilteredRows}
								globalFilter={globalFilter}
								setGlobalFilter={setGlobalFilter}
							/>
						</th>
						<th>
							<CSVLink filename={'deltadb.csv'} data={prepareData(props.headers, data)} style={{ backgroundColor: "transparent" }}>
								<button type="button" className="btn" id="secondaryColor" style={{ border: "none" }}><i className="bi bi-filetype-csv" style={{ color: "white" }} /></button>
							</CSVLink>
						</th>
					</tr>
				</thead>
			)}
			<tbody {...getTableBodyProps()}>
				<span style={{display: "block"}}>
					{page.map((row, id) => {
						prepareRow(row);
						return (
							<div style={{padding: "5px 10px", margin: "10px 20px", border: "0px solid white", borderRadius: "5px"}}>
							{content && !content[id] && row.cells.map((cell, index) => {
							return <Row key={index} style={{textAlign: "left"}}><Col>{cell.column && cell.column.Header ? cell.column.Header : ""}</Col><Col>{cell.value}</Col></Row>})}
							{content && content[id] && props.headers && props.headers.map((entry, index) => {
							return <Row key={index} style={{textAlign: "left"}}><Col>{entry.header}</Col><Col>{row.original[entry.name]}</Col></Row>})}
							<button type="button" onClick={() => {SetContent({...content, [id]: !content[id]})}} style={{ border: "none", backgroundColor: "transparent" }}><i className={`bi bi-chevron-${content && content[id] ? "up" : "down"}`} style={{ color: "white" }} /></button>
							</div>
						)
					})}
				</span>
			</tbody>
			{visible.footer && (
				<tfoot>
					<div className="centerDiv" style={{ display: "inline-flex", width: "100%" }}>
						<div className="btn-group" onClick={() => SetContent({})}>
							<button className="btn btn-default" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
								<i className="bi bi-chevron-left" id="secondaryColorText" />
							</button>
							<button className="btn btn-default" onClick={() => previousPage()} disabled={!canPreviousPage}>
								<i className="bi bi-caret-left-fill" id="secondaryColorText" />
							</button>
							{pageIndex - 3 >= 0 && (<button className="btn btn-default" id="secondaryColorText" onClick={() => gotoPage(pageIndex - 3)} disabled={!canPreviousPage}>
								{pageIndex - 2}
							</button>)}
							{pageIndex - 2 >= 0 && (<button className="btn btn-default" id="secondaryColorText" onClick={() => gotoPage(pageIndex - 2)} disabled={!canPreviousPage}>
								{pageIndex - 1}
							</button>)}
							{pageIndex - 1 >= 0 && (<button className="btn btn-default" id="secondaryColorText" onClick={() => gotoPage(pageIndex - 1)} disabled={!canPreviousPage}>
								{pageIndex}
							</button>)}
							<button className="btn btn-default" style={{ color: "white" }} disabled={true}>
								{pageIndex + 1}
							</button>
							{pageIndex + 1 < pageOptions.length && (<button className="btn btn-default" id="secondaryColorText" onClick={() => gotoPage(pageIndex + 1)} disabled={!canNextPage}>
								{pageIndex + 2}
							</button>)}
							{pageIndex + 2 < pageOptions.length && (<button className="btn btn-default" id="secondaryColorText" onClick={() => gotoPage(pageIndex + 2)} disabled={!canNextPage}>
								{pageIndex + 3}
							</button>)}
							{pageIndex + 3 < pageOptions.length && (<button className="btn btn-default" id="secondaryColorText" onClick={() => gotoPage(pageIndex + 3)} disabled={!canNextPage}>
								{pageIndex + 4}
							</button>)}
							<button className="btn btn-default" onClick={() => nextPage()} disabled={!canNextPage}>
								<i className="bi bi-caret-right-fill" id="secondaryColorText" />
							</button>
							<button className="btn btn-default" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
								<i className="bi bi-chevron-right" id="secondaryColorText" />
							</button>
						</div>
					</div>
				</tfoot>
			)}
		</table>
	);
}

export default TableComponent;
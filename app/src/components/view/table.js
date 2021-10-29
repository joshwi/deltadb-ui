/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label } from 'reactstrap';
import { CSVLink } from 'react-csv';
import _ from "underscore"
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
import "../../static/css/bootstrap.min.css"
import "../../static/css/main.css"

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
	const count = preFilteredRows.length;

	return (
		<input
			className="form-control"
			style={{ height: '1.5rem', marginLeft: "10%", width: "80%", backgroundColor: "#283448", color: "white" }}
			value={filterValue || ''}
			onChange={(e) => {
				setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
			}}
			placeholder={`${count} records`}
		/>
	);
}

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
	const count = preGlobalFilteredRows.length;

	return (
		<input
			className="form-control"
			style={{ height: '2rem', margin: '10px', backgroundColor: "#283448", color: "white" }}
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

function App(props) {

	const [data, SetData] = useState([])
	const [columns, SetColumns] = useState([])
	const [visible, SetVisible] = useState(false)

	const skipResetRef = React.useRef(false)

	useEffect(() => {
		if (props.headers) {
			let input = props.headers.filter(x => x.active === true).map((entry, index) => {
				return {
					Header: entry.header,
					accessor: entry.name,
					aggregate: entry.name,
					resize: true,
					// resize: props.headers.filter(x => x.active === true).length === index + 1 ? false : true,
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

	const getColumnWidth = (rows, accessor, headerText) => {
		const maxWidth = 400
		const magicSpacing = 10
		const cellLength = Math.max(
			...rows.map(row => (`${row[accessor]}` || '').length),
			headerText.length,
		)
		return Math.min(maxWidth, cellLength * magicSpacing)
	}

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
		// setPageSize,
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

	// Render the UI for your table
	return (
		<Container fluid className="table" style={{ color: "white", backgroundColor: "#283448" }}>
			<Row style={{ height: '50px', overflowX: "visible", overflowY: "hidden" }}>
				<Col xs="9">
					<GlobalFilter
						preGlobalFilteredRows={preGlobalFilteredRows}
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
				</Col>
				<Col xs="1" style={{ height: '2rem', margin: '12px' }}>
					<CSVLink filename={'deltadb.csv'} data={prepareData(props.headers, data)} style={{backgroundColor: "transparent"}}>
					<button type="button" class="btn btn-sm" style={{ border: "transparent", backgroundColor: "#ce0e0e", color: "white" }}><span>Export</span></button>
					</CSVLink>
				</Col>
				{/* <Col xs="1">
					<div style={{ display: 'table', height: '50px' }}>
						<div style={{ color: 'white', display: 'table-cell', verticalAlign: 'middle' }}>
							<Dropdown direction="left" size="sm" isOpen={visible} toggle={() => SetVisible(!visible)}>
								<DropdownToggle caret color="success">{pageSize}</DropdownToggle>
								<DropdownMenu>
									{[10, 25, 50, 100].map(pageSize => {
										return (
											<DropdownItem>
												<Label onClick={() => setPageSize(Number(pageSize))}>
													{pageSize} Items
											</Label>
											</DropdownItem>)
									})}
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>
				</Col> */}
			</Row>
			<Row style={{ border: "none", overflowX: "visible", overflowY: "hidden" }}>
				<Col>
					<table style={{ border: "none", backgroundColor: "#283448" }} {...getTableProps()}>
						<thead>
							<tr>
								{headerGroups.length > 1 && (
									<th className="th" {...headerGroups[1].getHeaderGroupProps()}>
										{headerGroups[1].headers.map((column, index) => (
											<>
												<div {...column.getHeaderProps()}>
													<span {...column.getSortByToggleProps()}>
														{column.render('Header')}
														{column.isSorted ? (column.isSortedDesc ? <i className="bi bi-chevron-down" style={{ color: "white", margin: "5px" }} /> : <i className="bi bi-chevron-up" style={{ color: "white", margin: "5px" }} />) : ''}
													</span>
													<div style={{ marginTop: "5px" }}>{column.canFilter ? column.render('Filter') : null}</div>
												</div>
												{column.resize && (
													<div className="parent" style={{ minHeight: "50px" }}>
														<div className="child">
															<i className="bi bi-grip-vertical" {...column.getResizerProps({ style: { color: "#ce0e0e", fontSize: "1.25rem" } })} />
														</div>
													</div>
												)}
											</>
										))}
									</th>
								)}
							</tr>
						</thead>
						<tbody {...getTableBodyProps()}>
							{page.map((row) => {
								prepareRow(row);
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map((cell) => {
											if (cell.column.Header === "TEAM" || cell.column.Header === "OPP") {
												let team = props.teams.colors.filter(x => x.team === cell.value).pop()
												return (
													<td {...cell.getCellProps({ style: { backgroundColor: team && team.primary_color ? team.primary_color : "", color: team && team.secondary_color ? team.secondary_color : "" } })}>
														{cell.value}
													</td>
												);
											} else {
												return (
													<td {...cell.getCellProps()}>
														{cell.value}
													</td>
												);
											}
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</Col>
			</Row>
			<Row style={{ color: 'white', marginTop: '10px', height: '50px', border: "none" }}>
				<Col style={{ display: 'flex', justifyContent: 'center' }}>
					<div style={{ display: 'table', height: '50px', backgroundColor: "transparent" }}>
						<div style={{ color: 'white', display: 'table-cell', verticalAlign: 'middle', whiteSpace: "nowrap" }}>
							{/* <Pagination {...{gotoPage: gotoPage, canPreviousPage: canPreviousPage, previousPage: previousPage, canPreviousPage: canPreviousPage, nextPage: nextPage, canNextPage: canNextPage,  pageCount: pageCount}}/> */}
							<div className="btn-group">
								<button className="btn btn-default" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
									<i className="bi bi-chevron-left" style={{ color: "white" }} />
								</button>
								<button className="btn btn-default" onClick={() => previousPage()} disabled={!canPreviousPage}>
									<i className="bi bi-caret-left-fill" style={{ color: "white" }} />
								</button>
								{pageIndex - 3 >= 0 && (<button className="btn btn-default" style={{ color: "white" }} onClick={() => gotoPage(pageIndex - 3)} disabled={!canPreviousPage}>
									{pageIndex - 2}
								</button>)}
								{pageIndex - 2 >= 0 && (<button className="btn btn-default" style={{ color: "white" }} onClick={() => gotoPage(pageIndex - 2)} disabled={!canPreviousPage}>
									{pageIndex - 1}
								</button>)}
								{pageIndex - 1 >= 0 && (<button className="btn btn-default" style={{ color: "white" }} onClick={() => gotoPage(pageIndex - 1)} disabled={!canPreviousPage}>
									{pageIndex}
								</button>)}
								<button className="btn btn-default" style={{ color: "#ce0e0e" }} disabled={true}>
									{pageIndex + 1}
								</button>
								{pageIndex + 1 < pageOptions.length && (<button className="btn btn-default" style={{ color: "white" }} onClick={() => gotoPage(pageIndex + 1)} disabled={!canNextPage}>
									{pageIndex + 2}
								</button>)}
								{pageIndex + 2 < pageOptions.length && (<button className="btn btn-default" style={{ color: "white" }} onClick={() => gotoPage(pageIndex + 2)} disabled={!canNextPage}>
									{pageIndex + 3}
								</button>)}
								{pageIndex + 3 < pageOptions.length && (<button className="btn btn-default" style={{ color: "white" }} onClick={() => gotoPage(pageIndex + 3)} disabled={!canNextPage}>
									{pageIndex + 4}
								</button>)}
								<button className="btn btn-default" onClick={() => nextPage()} disabled={!canNextPage}>
									<i className="bi bi-caret-right-fill" style={{ color: "white" }} />
								</button>
								<button className="btn btn-default" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
									<i className="bi bi-chevron-right" style={{ color: "white" }} />
								</button>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default App;
import React from "react"

function pagination(props) {

    // console.log(props)

    return (
        <div className="btn-group">
            <button
                className="btn btn-default"
                onClick={() => props.gotoPage(0)}
                disabled={!props.PreviousPage}
            >
                <i className="bi bi-chevron-left" style={{ color: "white" }} />
            </button>
            <button
                className="btn btn-default"
                onClick={() => props.previousPage()}
                disabled={!props.PreviousPage}
            >
                <i className="bi bi-caret-left-fill" style={{ color: "white" }} />
            </button>
            <button
                className="btn btn-default"
                onClick={() => props.nextPage()}
                disabled={!props.NextPage}
            >
                <i className="bi bi-caret-right-fill" style={{ color: "white" }} />
            </button>
            <button
                className="btn btn-default"
                onClick={() => props.gotoPage(props.pageCount - 1)}
                disabled={!props.NextPage}
            >
                <i className="bi bi-chevron-right" style={{ color: "white" }} />
            </button>
        </div>
    )
}

export default pagination
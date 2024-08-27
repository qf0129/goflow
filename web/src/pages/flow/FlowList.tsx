import { Button, PrimaryTable } from "tdesign-react"
import PageView from "../../components/PageView"
import { useEffect, useState } from "react"
import { ApiQueryFlow } from "../../apis/flow"
import { Flow } from "../../utils/types"
import { useNavigate } from "react-router-dom"

export default () => {
    const [tableData, setTableData] = useState<Flow[]>([])
    const columns = [
        { colKey: "Name", title: "名称" },
        { colKey: "Desc", title: "描述", width: 160 },
        { colKey: "CreateTime", title: "创建时间", width: 240, ellipsis: true },
    ]
    function requestList() {
        ApiQueryFlow().then(resp => {
            if (resp.code == 0) {
                console.log(resp.data)
                setTableData(resp.data.list)
            }
        })
    }

    useEffect(() => {
        requestList()
    }, [])

    const navigate = useNavigate()
    function handleRowClick({ row }: { row: Flow }) {
        navigate("/flow/" + row.Id)
    }

    return (
        <PageView title="FlowList" hideBack action={<Button>新建工作流</Button>}>
            <PrimaryTable
                rowKey="Id"
                columns={columns}
                data={tableData}
                pagination={{ defaultPageSize: 10, total: 30 }}
                size="medium"
                tableLayout="fixed"
                verticalAlign="middle"
                hover
                onRowClick={handleRowClick}
            />
        </PageView >
    )
}
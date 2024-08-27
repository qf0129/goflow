import { Card } from "tdesign-react"
import PageView from "../../components/PageView"
import { useEffect, useState } from "react"
import { ApiQueryFlow } from "../../apis/flow"
import { Flow } from "../../utils/types"
import { useParams } from "react-router-dom"
import FlowVersionTable from "../../components/tables/FlowVersionTable"

export default () => {
    const [flow, setFlow] = useState<Flow>()
    const { id } = useParams()

    function requestData() {
        ApiQueryFlow({ Id: id }).then(resp => {
            if (resp.code == 0 && resp.data.list.length > 0) {
                setFlow(resp.data.list[0])
            }
        })
    }

    useEffect(() => {
        requestData()
    }, [])


    return (
        <PageView title={'工作流: ' + flow?.Name || ''} >
            <Card title="信息" size="small" bordered={false}>
                <div>{flow?.Name}</div>
            </Card>
            <Card title="版本" size="small" bordered={false}>
                <FlowVersionTable flowId={id || ""} />
            </Card>
            <Card title="执行历史" size="small" bordered={false}>
                <FlowVersionTable flowId={id || ""} />
            </Card>
        </PageView >
    )
}
import { FC, ReactNode } from "react"
import { Space } from "tdesign-react"

interface CardViewProps {
    title: string
    children: ReactNode
    action?: ReactNode
}

const CardView: FC<CardViewProps> = ({ title, children, action }) => {
    return (
        <div style={{
            backgroundColor: "#fff",
            padding: "20px"
        }}>
            <div style={{ display: "flex", marginBottom: "10px" }}>
                <Space align="center" style={{ flex: 1 }}>
                    <h2>{title}</h2>
                </Space>
                <Space>
                    {action}
                </Space>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default CardView
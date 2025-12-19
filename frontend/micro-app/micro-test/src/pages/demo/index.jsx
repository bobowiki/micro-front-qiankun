import styles from "./index.module.css";
import { Button, Modal, Table } from "antd";
import { useState } from "react";
function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={styles.demo}>demo</div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Click Me
      </Button>
      <Modal open={open} title="这是一个弹窗" onCancel={() => setOpen(false)}>
        <Table
          columns={[
            {
              title: "id",
              dataIndex: "id",
            },
          ]}
          dataSource={[
            {
              id: 1,
            },
            {
              id: 2,
            },
          ]}
        ></Table>
      </Modal>
    </div>
  );
}

export default Demo;

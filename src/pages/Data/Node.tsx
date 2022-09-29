import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Table, Form, Input, message } from "antd";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import type { DataType } from "./index";
import { useSelector, useDispatch } from "react-redux";
import {
  NodeList,
  addNode,
  updateNode,
} from "@/Rudex/Slice/NodeSlice";
import useDebounce from "@/utils/useDebounce";

import { nanoid } from "nanoid";
const EditableContext = React.createContext<FormInstance<any> | null>(null);
//节点类型
interface Item {
  key: string;
  name: string;
  attribute: string;
  note: string;
}
interface EditableRowProps {
  index: number;
}
//编辑表格
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} onValuesChange={() => console.log(1)}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing); //编辑 / 不可编辑
    form.setFieldsValue({ [dataIndex]: record[dataIndex] }); //保存值
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log("触发编辑");
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input height={20} ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  //渲染
  return <td {...restProps}>{childNode}</td>;
};
export default function Node(props: any) {
  const { handleDelete } = props;
  const NodeSource = useSelector(NodeList);
  const dispatch = useDispatch();
  const [tmp, setSmp] = useState([] as DataType[]);
  //删除
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  //添加
  const handleAdd = () => {
    const newTmp: DataType = {
      key: nanoid(),
      name: " ",
      attribute: "",
      note: "",
    };
    if (!tmp.length) {
      setSmp((tmp: any[]) => [...tmp, newTmp]);
      message.success("请输入节点信息值");
      dispatch(addNode(newTmp));
    } else {
      message.warning("请输入节点信息值");
    }
  };
  //保存
  const handleSave = (row: DataType, type: string) => {
    //添加数据
    const res = judge(row.name, NodeSource);
    if (res) {
      dispatch(updateNode(row));
      setSmp([]); //清空缓存
    } else {
      message.warning("重复节点");
    }
  };
  const judge = (data: string, list: DataType[]) => {
    console.log(list, data);
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.name == data) {
        return false;
      }
    }
    return true;
  };
  let NodeCol = [
    {
      title: "节点名",
      dataIndex: "name",
      key: "name",
      width: "20%",
      editable: true,
    },
    {
      title: "属性",
      width: "20%",
      dataIndex: "attribute",
      key: "attribute",
      editable: true,
    },
    {
      title: "备注",
      dataIndex: "note",
      width: "20%",
      key: "note",
      editable: true,
    },
    {
      title: "删除",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return NodeSource.length >= 1 ? (
          <Button danger onClick={() => handleDelete(record.key, "node")}>
            删除
          </Button>
        ) : null;
      },
    },
  ];
  //可编辑列
  NodeCol = NodeCol.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="nodeTbale">
      <Button
        type="primary"
        onClick={useDebounce(handleAdd)}
        style={{ float: "right" }}
      >
        添加节点
      </Button>
      <Table
        components={components}
        size="small"
        columns={NodeCol}
        dataSource={NodeSource}
        rowClassName={() => "editable-row"}
        bordered
      />
    </div>
  );
}

import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Table, Form, Input, message } from "antd";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import type { NodeType } from "./index";
import { useSelector } from "react-redux";
import { NodeList, addNode, updateNode } from "@/Rudex/Slice/NodeSlice";
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
    <Form form={form} component={false}>
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
    console.log(1);
    
    try {
      const values = await form.validateFields();
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
            message: `${title}必填`,
          },
        ]}
      >
        <Input
          style={{ border: "0", marginRight: "0" }}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  //渲染
  return <td {...restProps}>{childNode}</td>;
};
export default function Node(props: any) {
  const { handleDelete, dispatch } = props;
  const NodeSource = useSelector(NodeList);
  const [tmp, setSmp] = useState([] as NodeType[]);
  //删除
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  //添加
  const handleAdd = () => {
    const newTmp: NodeType = {
      key: nanoid(),
      name: "节点名",
      attribute: "属性",
      note: "备注",
    };
    if (!tmp.length) {
      message.info("请输入节点信息值");
      setSmp((tmp: any[]) => [...tmp, newTmp]);
      dispatch(addNode(newTmp));
    } else {
      message.info("请输入节点信息值");
    }
  };
  //保存
  const handleSave = (row: NodeType, type: string) => {
    //添加数据
    const res = judge(row.name, NodeSource);
    if (res) {
      dispatch(updateNode(row));
      setSmp([]); //清空缓存
    }
  };
  //重复节点?
  const judge = (data: string, list: NodeType[]) => {
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
          <Button
            danger
            onClick={async () => {
              setSmp([]);
              handleDelete(record.key, "node");
            }}
          >
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
      onCell: (record: NodeType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className='nodeTbale'>
      <Button className='btn' onClick={useDebounce(handleAdd)}>
        添加节点
      </Button>
      <Table
        pagination={{ pageSize: 5 }}
        scroll={{ y: 240 }}
        components={components}
        size='small'
        columns={NodeCol}
        dataSource={NodeSource}
        rowClassName={() => "editable-row"}
      />
    </div>
  );
}

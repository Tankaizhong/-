import { Button, Table, Form, Input, InputRef, Select, DatePicker } from "antd";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  ChartList,
  addRela,
  updataRela,
} from "@/Rudex/Slice/LinkSlice";
import { NodeList } from "@/Rudex/Slice/NodeSlice";
import { FormInstance } from "antd/es/form";
import { nanoid } from "nanoid";
import { NodeType } from ".";
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
  key: string;
  start: string;
  target: string;
}
interface EditableRowProps {
  index: number;
}

export interface LinkType {
  key: string;
  source: string;
  target: string;
}
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
  data: string[];
  curEdit: boolean;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  data,
  handleSave,
  curEdit,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext)!;
  const toggleEdit = () => {
    setEditing(!editing); //编辑 / 不可编辑
    form.setFieldsValue({ [dataIndex]: record[dataIndex] }); //保存值
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Select
          style={{ border: "0" }}
          value={selectedItems}
          placeholder="Inserted are removed"
          onChange={setSelectedItems}
          onBlur={save}
        >
          {data.map((item: any) => {
            return (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  //渲染
  return <td {...restProps}>{childNode}</td>;
};

export default function Link(props: any) {
  const { handleDelete, dispatch } = props;
  const [curEdit, setEdit] = useState(true);
  //节点列表获取
  const data: string[] = [];
  useSelector(NodeList).forEach((element: NodeType) => {
    data.push(element.name);
  });
  //保存
  const handleSave = (row: LinkType, type: string) => {
    //添加数据
    // console.log(row);
    dispatch(updataRela(row));
    setEdit((val) => !val);
  };
  const ChartSource = useSelector(ChartList);
  let ChartCol = [
    {
      title: "起点",
      dataIndex: "source",
      key: "source",
      width: "20%",
      editable: true,
    },
    {
      title: "终点",
      dataIndex: "target",
      key: "target",
      editable: true,
      width: "20%",
    },
    {
      title: "删除",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return ChartSource.length >= 1 ? (
          <Button danger onClick={() => handleDelete(record.key, "chart")}>
            删除
          </Button>
        ) : null;
      },
    },
  ];
  //可编辑列
  ChartCol = ChartCol.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: LinkType) => ({
        record,
        data,
        curEdit,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleAdd = () => {
    const newTmp: LinkType = {
      key: nanoid(),
      source: "选择起点",
      target: "选择终点",
    };
    dispatch(addRela(newTmp));
  };

  return (
    <>
      <Button className="btn" onClick={handleAdd}>
        添加关系
      </Button>
      <Table
        pagination={{ pageSize: 5 }}
        scroll={{ y: 240 }}
        components={components}
        size="small"
        columns={ChartCol}
        dataSource={ChartSource}
      />
    </>
  );
}

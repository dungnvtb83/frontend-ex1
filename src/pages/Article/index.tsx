import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Row, Col, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getArticles, addArticle, updateArticle, deleteArticle } from '@/services/ant-design-pro/api';
import UpdateForm from './components/UpdateForm';
import type { FormValueType } from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

 const handleAdd = async (fields: API.ArticleItem) => {
    const hide = message.loading('Adding');
  
    try {
      await addArticle({ ...fields });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('Updating');
    try {
      await updateArticle(fields);
      hide();
  
      message.success('Updated is successful');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed, please try again!');
      return false;
    }
  };

  const handleDelete = async (fields: API.ArticleItem) => {
    const hide = message.loading('Deleting');
  
    try {
      await deleteArticle({ ...fields });
      hide();
      message.success('Deleted successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Deleting failed, please try again!');
      return false;
    }
  };

const Article: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ArticleItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.ArticleItem[]>([]);
  
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.ArticleItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.article.updateForm.name.label"
          defaultMessage="Title"
        />
      ),
      dataIndex: 'title',
      sorter: true,
      filters: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.article.body"
          defaultMessage="Body"
        />
      ),
      sorter: true,
      search: false,
      dataIndex: 'body',
    },
    {
      title: (
        <FormattedMessage
          id="pages.article.createdAt"
          defaultMessage="Created At"
        />
      ),
      sorter: true,
      dataIndex: 'created_at',
      valueType: 'dateTime',
      search: false,
    },
    {
        title: (
          <FormattedMessage
            id="pages.article.updatedAt"
            defaultMessage="Updated At"
          />
        ),
        sorter: true,
        dataIndex: 'updated_at',
        valueType: 'dateTime',
        search: false,
    },
    {
        title: <FormattedMessage id="pages.article.titleOption" defaultMessage="Action" />,
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => [
              <a
              key="config"
              onClick={() => {
                setCurrentRow(record);
                handleUpdateModalVisible(true);
              }}
            >
              <FormattedMessage id="pages.article.edit" defaultMessage="Edit" />
            </a>,
            <a
            key="config"
            onClick={() => {
              setCurrentRow(record);
              setVisibleDelete(true);
            }}
            >
            <FormattedMessage id="pages.article.delete" defaultMessage="Delete" />
           </a>
        ],
      },
  ];

  return (
    <PageContainer>
      <Modal
        title={"Delete Confirmation"}
        visible={visibleDelete}
        onOk={async()=>{
          const success = await handleDelete({id: currentRow?.id} as FormValueType);
          if (success) {
            setVisibleDelete(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={()=>{
          setVisibleDelete(false);
        }}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure to delete the <b>{currentRow?.title}</b>?</p>
      </Modal>
      <ProTable<API.ArticleItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.article.form.title',
          defaultMessage: 'Article Form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
            <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>
        ]}
        request={(params, sorted)=>{
          const sort = Object.keys(sorted)? Object.keys(sorted)[0] : "";
          const direction = Object.values(sorted)? Object.values(sorted)[0]?.replace('end', '') : "";
          return getArticles({...params, sort, direction });
        }}
        columns={columns}
        rowSelection={false}
      />

      <ModalForm
            title={intl.formatMessage({
              id: 'pages.article.createForm.new',
              defaultMessage: 'New Article',
            })}
            width="600px"
            visible={createModalVisible}
            onVisibleChange={handleModalVisible}
            modalProps={{destroyOnClose: true}}
            onFinish={async (value) => {
              const success = await handleAdd(value as API.ArticleItem);
              if (success) {
                handleModalVisible(false);
                actionRef?.current?.reload();
              }
            }}
      >
        <>
           
                <ProFormText
                    rules={[
                        {
                        required: true,
                        message: (
                            <FormattedMessage
                            id="pages.article.name.required"
                            defaultMessage="The Title is required"
                            />
                        ),
                        },
                    ]}
                    width="lg"
                    name="title"
                    placeholder={intl.formatMessage({
                        id: 'pages.article.updateForm.name.placeholder',
                        defaultMessage: 'Please input the Title!',
                    })}
                    label="Title"
                />

              <ProFormText
                      rules={[
                          {
                          required: true,
                          message: (
                              <FormattedMessage
                              id="pages.article.name.required"
                              defaultMessage="The Body is required"
                              />
                          ),
                          },
                      ]}
                      width="lg"
                      name="body"
                      placeholder={intl.formatMessage({
                          id: 'pages.article.updateForm.name.placeholder',
                          defaultMessage: 'Please input the Body!',
                      })}
                      label="Body"
                />
           
          </>
      </ModalForm>
    
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate({...value, id: currentRow?.id });
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            setShowDetail(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      /> 

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.title && (
          <ProDescriptions<API.ArticleItem>
            column={2}
            title={currentRow?.title}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.title,
            }}
            columns={columns as ProDescriptionsItemProps<API.ArticleItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Article;

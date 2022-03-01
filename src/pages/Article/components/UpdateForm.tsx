import React from 'react';
import { Col, Modal, Row } from 'antd';
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

export type FormValueType = {
    id?: string,
    name?: string;
} & Partial<API.ArticleItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.ArticleItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (

    <Modal
      width={"600px"}
      destroyOnClose={true}
      title={intl.formatMessage({
        id: 'pages.article.updateForm.title',
        defaultMessage: 'Edit Article',
      })}
      visible={props.updateModalVisible}
      onCancel={() => {
        props.onCancel();
      }}
      footer={null}
    >
      <ProForm
        initialValues={{
          title: props.values.title,
          body: props.values.body,
        }}
        onFinish={props.onSubmit}
        submitter={{
          searchConfig: {
            resetText: "Cancel",
            submitText: "OK"
          },
          onReset:()=>{
            props.onCancel();
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
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;

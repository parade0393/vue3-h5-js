// import {fileUploadApi} from "@/api/common"
/**
 * name:表单字段
 * label:表单项名称
 * type:表单类型
 * props:vant组件支持的props,
 * childProps:直接子组件的props
 * nestChildProps:嵌套子组件的props 比如checkbox-group,van-checkbox-group使用childProps,van-checkbox使用nestChildProps
 * show:是否是隐藏字段，如果有visible配置且返回值为false的话，show将失去意义
 * dependencies:用来配置关联字段，参数是当前值和当年表单的数据
 * rules：校验规则，validate的参数是当前值和当年表单的数据,也支持vant的其他校验规则
 * events:事件，前两个参数是当前value和整改表单的数据，后面的参数有事件对象和框架传递的参数
 * listenChange:是否监听v-model的改变，如果为true，则会根据dependencies来做响应的处理
 * dependencies：依赖该字段的所有字段
 *
 * formatType:时间选择器会用到,控件提供的数据格式是区间时,默认值以,分格
 * 使用calendar时注意有默认minDate和maxDate
 */
export const formConfig = [
    {
      name: 'name',
      label: '姓名',
      type: 'input',
      placeholder: '请输入姓名',
      props:{required:true,},
      show:true,
      defaultValue: '',
      rules: [
        { validator: value => !!value, message: '请输入姓名' },
      ],
      events:{
        focus:(value,formData,event)=>{
          console.log("name,focus",value,formData,event);

        }
      }
    },
    {
      name: 'age',
      label: '年龄',
      type: 'input',
      placeholder: '请输入年龄',
      defaultValue: 18,
      show:true,
      props:{type:"digit",},
      events:{
        focus:(value,formData,event)=>{
          console.log("name,focus",value,formData,event);

        }
      }
    },
    {
      name: 'gender',
      label: '性别',
      show:true,
      type: 'radio-group',
      placeholder: '请选择性别',
      childProps: {
        direction: 'horizontal',
      },
      options: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' },
      ],
      defaultValue: '',
      rules: [
        { validator: value => !!value, message: '请选择性别' },
      ],
    },
    {
      name: 'maritalStatus',
      show:true,
      label: '婚姻状况',
      type: 'radio-group',
      childProps: {
        direction: 'horizontal',
      },
      placeholder: '请选择婚姻状况',
      options: [
        { value: 'single', label: '未婚' },
        { value: 'married', label: '已婚' },
      ],
      defaultValue: '',
      visible: (formData) => formData.age >= 23,
      listenChange:true,
      dependencies: [
        {
          field: 'spouseName',
          getValue: (value, formData) => {
            console.log("maritalStatus ---getValue");

            return value === 'married' ? (formData['gender'] == 'male'?'妻子姓名':'丈夫姓名') : null
          },
        },
      ],
    },
    {
      name: 'spouseName',
      show:true,
      label: '配偶姓名',
      type: 'input',
      placeholder: '请输入配偶姓名',
      defaultValue: '',
      visible: (formData) => formData.age >= 23 && formData.maritalStatus === 'married',
      rules: [
        { validator: (value, formData) => formData.maritalStatus !== 'married' || !!value, message: '已婚时配偶姓名为必填' },
      ],
    },
    {
      name:"isNeed",
      label:"是否开启",
      show:true,
      type:"switch",
      childProps:{size:"6vw"}
    },
    {
      name:"transfer",
      label:'是否转发',
      type:"checkbox",
      show:true,
      defaultValue:false
    },
    {
      name:"count",
      label:'数量',
      type:"stepper",
      show:true,
      defaultValue:0,
      childProps:{
        min:0
      }
    },
    {
      name:"score",
      label:"得分",
      show:true,
      type:"rate",
      defaultValue:0
    },
    {
      name:"progress",
      label:"进度",
      show:true,
      type:"slider",
      defaultValue:0
    },
    {
        name: 'interests',
        show:true,
        label: '兴趣爱好',
        type: 'checkbox-group',
        childProps: {
          direction: 'horizontal',
        },
        options: [
          { value: 'reading', label: '阅读', props: { shape: 'square' } },
          { value: 'sports', label: '运动', props: { shape: 'square' } },
        ],
        defaultValue: [],
        rules: [
          { validator: value => value.length > 0, message: '请至少选择一个兴趣爱好' },
        ],
      },
      {
        name:"file",
        type:"file",
        label:"文件上传",
        show:true,
        uploadApi:()=>{},
        defaultValue:[],
        handlerResponse:(res)=>{return res.data[0]},
        rules:[
          {validator:value => value.length>0 ,message:"请上传附件"}
        ]
      },
      {
        name:"picker",
        type:"picker",
        label:"请选择类型",
        placeholder:"请选择城市",
        show:true,
        props:{
          "is-link":true,
          "readonly":true,
          "input-align":"right"
        },
        childProps:{
          "position":"bottom"
        },
        nestChildProps:{
          "default-index":2
        },
        defaultValue:"温州",
        rules: [
          { validator: value => !!value, message: '请选择lei' },
        ],
        options:['杭州', '宁波', '温州', '嘉兴', '湖州']
      },
      {
        name:"pickerTime",
        type:"picker",
        label:"多列选择",
        placeholder:"请选择城市",
        show:true,
        props:{
          "is-link":true,
          "readonly":true,
        },
        childProps:{
          "position":"bottom"
        },
        defaultValue:"周三,下午",//是个字符串
        options:[
          // 第一列
          {
            values: ['周一', '周二', '周三', '周四', '周五'],
            defaultIndex: 2,
          },
          // 第二列
          {
            values: ['上午', '下午', '晚上'],
            defaultIndex: 1,
          },
        ]
      },
      {
        name:"startTime",
        label:"开始时间",
        type:"dateTime",
        props:{
          "is-link":true,
          "readonly":true,
        },
        childProps:{
          position:"bottom"
        },
        nestChildProps:{
          type:"date"
        },
        show:true,
        defaultValue:"2023-11-12",
        placeholder:"请选择开始时间",
        formatType:"YYYY-MM-DD",
        rules: [
          { validator: value => !!value, message: '请选择开始时间' },
        ],
      },
      {
        name:"endTime",
        label:"请选择结束日期",
        type:"calendar",
        show:true,
        placeholder:"请选择结束日期",
        formatType:"YYYY-MM-DD",
        defaultValue:"2024-10-12",
        props:{
          "is-link":true,
          "readonly":true,
        }
      },
      {
        name:"bet",
        label:"请选择日期区间",
        type:"calendar",
        show:true,
        placeholder:"请选择开始日期至结束日期",
        props:{
          "is-link":true,
          "readonly":true,
        },
        childProps:{
          type:"range"
        },
        defaultValue:"2024-10-12至2024-11-13",
        formatType:"YYYY-MM-DD",
        "range-separator":"至"
      }
  ];

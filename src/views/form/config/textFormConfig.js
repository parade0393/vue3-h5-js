/**
 * name:表单字段
 * label:表单项名称
 * type:表单类型
 * props:vant组件支持的props
 * show:是否是隐藏字段，如果有visible配置且返回值为false的话，show将失去意义
 * dependencies:用来配置关联字段，参数是当前值和当年表单的数据
 * rules：校验规则，validate的参数是当前值和当年表单的数据,也支持vant的其他校验规则
 * events:事件，前两个参数是当前value和整改表单的数据，后面的参数有事件对象和框架传递的参数
 * listenChange:是否监听v-model的改变，如果为true，则会根据dependencies来做响应的处理
 * dependencies：依赖该字段的所有字段
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
          console.log("name,focus",formData,event);

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
          console.log(value,formData,event);

        }
      }
    },
    {
      name: 'gender',
      label: '性别',
      show:true,
      type: 'radio-group',
      placeholder: '请选择性别',
      props: {
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
      props: {
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
      props:{size:"6vw"}
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
      props:{
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
        props: {
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
        name:'city',
        label:"选择器",
        type:"picker",
        show:true,
        options:[
          { text: '杭州', value: 'Hangzhou' },
          { text: '宁波', value: 'Ningbo' },
          { text: '温州', value: 'Wenzhou' },
          { text: '绍兴', value: 'Shaoxing' },
          { text: '湖州', value: 'Huzhou' },
        ]
      }
  ];

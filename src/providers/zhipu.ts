export default {
  icon: "i-carbon-navaid-ndb",
  name: "智谱清言",
  href: "https://open.bigmodel.cn/usercenter/apikeys",
  defaultModel: "glm-3-turbo",
  placeholder: "API Key",
  models: [
    {
      label: "GLM-3-Turbo",
      value: "glm-3-turbo",
      input: 0.001,
      output: 0.001,
      context_length: 32000,
    },
    {
      label: "GLM-4",
      value: "glm-4",
      input: 0.1,
      output: 0.1,
      context_length: 128000,
    },
    {
      label: "GLM-4-V",
      value: "glm-4v",
      input: 0.1,
      output: 0.1,
      context_length: 128000,
    },
  ],
};

import Models from "~/openrouter.json";

export default {
  icon: "i-simple-icons-alwaysdata",
  name: "OpenRouter",
  href: "https://openrouter.ai/keys",
  defaultModel: "openrouter/auto",
  models: Models.data.map((v) => ({
    value: v.id,
    label: v.name,
    input: Number(v.pricing.prompt),
    output: Number(v.pricing.completion),
    context_length: Number(v.context_length)
  })),
  placeholder: "API Key",
};

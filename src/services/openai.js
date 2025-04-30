import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateReadme(data) {
  const prompt = `
Crie um README.md com base nas informações:
Nome do Projeto: ${data.projectName}
Descrição: ${data.description}
Tecnologias: ${data.technologies}
Instalação: ${data.installation}
Uso: ${data.usage}
Licença: ${data.license}
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

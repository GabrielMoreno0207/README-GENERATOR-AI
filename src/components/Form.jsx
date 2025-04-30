import { useState } from "react";

export default function Form({ onSubmit }) {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    technologies: "",
    usage: "",
    installation: "",
    license: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const labels = {
    projectName: "Nome do Projeto",
    description: "Descrição",
    technologies: "Tecnologias",
    usage: "Uso",
    installation: "Instalação",
    license: "Licença",
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block mb-1 font-medium" htmlFor={key}>
            {labels[key] || key}
          </label>
          <textarea
            id={key}
            name={key}
            value={value}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Gerar README
      </button>
    </form>
  );
}

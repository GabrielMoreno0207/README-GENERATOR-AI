import { useState, useEffect } from "react";
import Form from "./components/Form";
import { generateReadme } from "./services/openai";

function App() {
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedReadme, setEditedReadme] = useState("");
  const [isMarkdownCommandsOpen, setIsMarkdownCommandsOpen] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const result = await generateReadme(formData);
      setReadme(result);
      setEditedReadme(result);
    } catch (error) {
      alert("Erro ao gerar README: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (readme) {
      await navigator.clipboard.writeText(readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveEdit = () => {
    setReadme(editedReadme);
    handleModalClose();
  };

  const handleMarkdownCommandsToggle = () => {
    setIsMarkdownCommandsOpen(!isMarkdownCommandsOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "c") {
        console.log("Ctrl + C pressionado");
      } else if (e.ctrlKey && e.key === "v") {
        console.log("Ctrl + V pressionado");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Gerador de README</h1>
      <Form onSubmit={handleSubmit} />

      {loading && <p className="mt-4 text-green-600 text-center">Gerando README...</p>}

      {readme && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">Visualização do Markdown</h2>
          <pre className="bg-gray-900 text-green-200 p-4 rounded border border-green-500 whitespace-pre-wrap overflow-x-auto text-sm">
            {readme}
          </pre>
        </div>
      )}

      {readme && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleCopy}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>

          <button
            onClick={handleModalOpen}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
          >
            Editar README
          </button>
        </div>
      )}

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-md w-2/3 max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">Editar README</h3>
            <textarea
              value={editedReadme}
              onChange={(e) => setEditedReadme(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={8}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Comandos Markdown */}
      {isMarkdownCommandsOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 text-green-200 p-6 rounded-md w-2/3 max-w-3xl overflow-auto border border-green-500">
            <h3 className="text-xl font-semibold mb-4">Comandos Markdown</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>**Negrito**:</strong> `**texto**` ou `__texto__`</li>
              <li><strong>*Itálico*:</strong> `*texto*` ou `_texto_`</li>
              <li><strong>[Link](url):</strong> `[texto](https://url.com)`</li>
              <li><strong># Título:</strong> `#`, `##`, `###` etc.</li>
              <li><strong>- Lista:</strong> `- item` ou `* item`</li>
              <li><strong>1. Lista numerada:</strong> `1. item`</li>
              <li><strong>``` Código ```:</strong> usar crases triplas</li>
              <li><strong>`Código inline`:</strong> usar uma crase</li>
              <li><strong>Citação:</strong> `{'>'} texto`</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">Como exibir combinações de teclas</h3>
            <p className="mb-2">Use a tag HTML <code>{`<kbd>`}</code> dentro do Markdown para representar teclas:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Exemplo:</strong> <code>{'<kbd>Ctrl</kbd> + <kbd>C</kbd>'}</code></li>
              <li><strong>Resultado:</strong> <kbd>Ctrl</kbd> + <kbd>C</kbd></li>
              <li>Você pode usar várias teclas: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></li>
            </ul>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleMarkdownCommandsToggle}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleMarkdownCommandsToggle}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Comandos Markdown
        </button>
      </div>
      <footer className="mt-12 text-center text-sm text-green-600 border-t border-green-700 pt-4">
  Desenvolvido por{" "}
  <a
    href="https://github.com/GabrielMoreno0207"
    target="_blank"
    rel="noopener noreferrer"
    className="underline hover:text-green-400 transition-colors font-semibold"
  >
    Gabriel Moreno 💻
  </a>
</footer>


    </div>
  );
}

export default App;

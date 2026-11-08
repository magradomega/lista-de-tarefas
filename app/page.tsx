
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [carregado, setCarregado] = useState(false);
  const [tarefas, setTarefas] = useState<string[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [concluidas, setConcluidas] = useState<string[]>([]);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
  const tarefasSalvas = localStorage.getItem("tarefas");

  if (tarefasSalvas) {
    const dados = JSON.parse(tarefasSalvas);

    setTarefas(dados.tarefas);
    setConcluidas(dados.concluidas);
  }

  setCarregado(true);
}, []);
useEffect(() => {
  if (carregado) {
    localStorage.setItem(
      "tarefas",
      JSON.stringify({
        tarefas: tarefas,
        concluidas: concluidas,
      })
    );
  }
}, [tarefas, concluidas, carregado]);
  

  function adicionarTarefa(e: React.FormEvent) {
    e.preventDefault();

    if (novaTarefa.trim() === "") return;

    setTarefas([...tarefas, novaTarefa]);
    setNovaTarefa("");
  }

  function concluirTarefa(nome: string) {
    if (concluidas.includes(nome)) {
      setConcluidas(concluidas.filter((t) => t !== nome));
    } else {
      setConcluidas([...concluidas, nome]);
    }
  }

  function excluirTarefa(nome: string) {
    setTarefas(tarefas.filter((t) => t !== nome));
    setConcluidas(concluidas.filter((t) => t !== nome));
  }

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "pendentes") return !concluidas.includes(tarefa);
    if (filtro === "concluidas") return concluidas.includes(tarefa);
    return true;
  });

  return (
    <main className="container">
      <h1>Minha Lista de Tarefas</h1>
      <p>Organize suas atividades!</p>

      <form onSubmit={adicionarTarefa}>
        <input
          type="text"
          placeholder="Digite uma tarefa..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <h3>Total de tarefas: {tarefas.length}</h3>

      <div className="filtros">
        <button onClick={() => setFiltro("todas")}>Todas</button>
        <button onClick={() => setFiltro("pendentes")}>Pendentes</button>
        <button onClick={() => setFiltro("concluidas")}>Concluídas</button>
      </div>

      <ul>
        {tarefasFiltradas.map((tarefa, index) => (
          <li key={index}>
            <span className={concluidas.includes(tarefa) ? "concluida" : ""}>
              {tarefa}
            </span>

            <div>
              <button onClick={() => concluirTarefa(tarefa)}>
                {concluidas.includes(tarefa) ? "Desfazer" : "Concluir"}
              </button>

              <button
                className="excluir"
                onClick={() => excluirTarefa(tarefa)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

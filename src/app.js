const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const findRepositoryIndexById = (id) =>
  repositories.findIndex((repository) => repository.id === id);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0)
    return response.status(400).json({
      success: false,
      message: `Nenhum repositório encontrado com o id ${id}`,
    });

  if (request.body.likes) return response.status(400).json({ likes: 0 });

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0)
    return response.status(400).json({
      success: false,
      message: `Nenhum repositório encontrado com o id ${id}`,
    });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0)
    return response.status(400).json({
      success: false,
      message: `Nenhum repositório encontrado com o id ${id}`,
    });

  repositories[repositoryIndex].likes += 1;

  return response.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;

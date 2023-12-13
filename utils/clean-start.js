// clean start

// Aplicação que carrega arquivos .json
// em dado diretório e os submete para
// o servidor indicado (CREATE). A tentativa
// de criação só ocorre após remover instância
// correspondentes, caso existam.

// USO:
// node clean-start.js c:\temp (servidor padrão)
// node clean-start.js c:\temp http://localhost:8080/fhir  (servidor fornecido)

const fs = require("fs");
const path = require("node:path");
const axios = require("axios");

function servidorPadrao(recurso) {
  return `http://hapi.fhir.org/baseR4/${recurso}`;
}

function servidorFornecido(servidor) {
  return (recurso) => `${servidor}/${recurso}`;
}

let getUrl = process.argv.length > 3 
  ? servidorFornecido(process.argv[3]) 
  : servidorPadrao;

// Retorna objeto com as seguintes proprieades:
// nome do recurso (propriedade recurso), o recurso (object) 
// propriamente dito (propriedade conteudo) e a url canônica
// do recurso (propriedade url).
function carregar(arquivo) {
  return new Promise((resolve, reject) => {
    fs.readFile(arquivo, "utf8", (err, jsonString) => {
      if (err) {
        reject(err);
        return;
      }

      const json = JSON.parse(jsonString);
      const recurso = json.resourceType;
      const url = json.url;

      resolve({ recurso: recurso, conteudo: json, url });
    });
  });
}

// Submete o conteúdo do recurso (nome) depositado no arquivo
// para criação
function acrescentar(recurso, arquivo, conteudo) {
  let servidor = getUrl(recurso);
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };

  return axios
    .post(servidor, JSON.stringify(conteudo), config)
    .then((res) => {
      if (res.status === 201) {
        return { arquivo: arquivo, retorno: "ok" };
      }
    })
    .catch((err) => {
      return { arquivo: arquivo, retorno: "erro ao acrescentar" };
    });
}

/**
 * Obtém identificador lógico utilizado pelo servidor para a
 * url canônica fornecida para recurso do tipo indicado.
 *
 * @param {string} tipo O nome do recurso, por exemplo, "Patient".
 * @param {string} url A url canônica da instância de conformidade
 * @returns O identificador lógico ou a sequência vazia, caso não seja encontrado.
 */
function searchByUrl(tipo, url) {
  const server = getUrl(tipo) + "?url=" + url;

  // Evita resposta "falsa"
  const config = {
    headers: {
      "Cache-Control": "no-cache", // Para navegadores modernos
      Pragma: "no-cache", // Para navegadores mais antigos
    },
  };

  return axios
    .get(server, config)
    .then((res) => {
      console.log(server, res.status);
      if (res.status !== 200) {
        throw new Error("Busca não realizada satisfatoriamente...");
      }

      return getFulUrlsOfEntries(res.data.entry);
    })
    .catch((err) => {
      console.log("Falha de interação com", server);
      return [];
    });
}

function searchByUniqueId(uniqueId) {
  const server = getUrl("NamingSystem") + "?value=" + uniqueId;

  // Evita resposta "desatualizada"
  const config = {
    headers: {
      "Cache-Control": "no-cache", // Para navegadores modernos
      Pragma: "no-cache", // Para navegadores mais antigos
    },
  };

  return axios
    .get(server, config)
    .then((res) => {
      console.log(server, res.status);
      if (res.status !== 200) {
        throw new Error("Busca não realizada satisfatoriamente...");
      }

      return getFulUrlsOfEntries(res.data.entry);
    })
    .catch((err) => {
      console.log("Falha de interação com", server);
      return [];
    });
}

function getFulUrlsOfEntries(entradas) {
  if (entradas === undefined) {
    return [];
  }
  const ids = [];
  entradas.forEach((e) => ids.push(e.fullUrl));
  return ids;
}

// Identifica os arquivos relevantes (extensão .json)
async function arquivosRelevantes(diretorio) {
  return new Promise((resolve, reject) => {
    fs.readdir(diretorio, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const jsons = files.filter(
        (f) => path.extname(f).toLocaleLowerCase() === ".json"
      );

      const paths = jsons.map((a) => path.join(diretorio, a));
      resolve(paths);
    });
  });
}

async function start(arquivos) {
  try {
    console.log("Total de arquivos para carregar:", arquivos.length);

    for (let i = 0; i < arquivos.length; i++) {
      const { recurso, conteudo, url } = await carregar(arquivos[i]);

      // Ignore o que não são de conformidade
      if (!recursoDeConformidade(recurso)) {
        console.log(`[${i}] ${arquivos[i]} não contém recurso de conformidade`);
        continue;
      }

      console.log(
        `\n[${i}] ==> ${recurso} ${!!url ? url : ""}\n${arquivos[i]}`
      );

      // Identificar fullUrls do que deve ser removido
      let paraRemover;
      if (recurso === "NamingSystem") {
        const uniqueId = conteudo.uniqueId[0].value;
        paraRemover = await searchByUniqueId(uniqueId);
      } else {
        paraRemover = await searchByUrl(recurso, url);
      }

      console.log("Remover", paraRemover);
      paraRemover.forEach(remover);
      await acrescentar(recurso, arquivos[i], conteudo).then(console.log);
    }
  } catch (erro) {
    console.log("Ocorreu erro:", erro);
  }
}

function recursoDeConformidade(recurso) {
  return (
    recurso === "StructureDefinition" ||
    recurso === "ValueSet" ||
    recurso === "CodeSystem" ||
    recurso === "NamingSystem"
  );
}

async function identificaRecursosParaCriacao(caminho) {
  return new Promise((resolve, reject) => {
    fs.stat(caminho, async (err, stats) => {
      if (err) {
        reject(err);
      } else {
        let arquivos;
        if (stats.isDirectory()) {
          console.log("Localizando arquivos em", caminho);
          arquivos = await arquivosRelevantes(caminho);
        } else {
          console.log("Criando arquivo em servidor:", caminho);
          arquivos = [caminho];
        }

        resolve(arquivos);
      }
    });
  });
}

/**
 * Remove a instância do recurso identificada unicamente pela URL
 * @param {string} tipo A fullUrl para o recurso
 * @returns Nada é retornado
 */
function remover(url) {
  return axios.delete(url).catch((err) => {
    console.log("ocorreu erro", err);
  });
}

function main() {
  // Como usar?
  console.log("node carregar.js (<dir>|<arquivo>) [<servidor>]");

  // Padrão: diretório corrente
  let diretorio = __dirname;

  // Se pelo menos um argumento fornecido, então
  // será utilizado como o diretório ou arquivo
  // a ser carregado
  if (process.argv.length > 2) {
    diretorio = process.argv[2];
  }

  identificaRecursosParaCriacao(diretorio).then(start);
}

main();
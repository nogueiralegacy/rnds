# NPM Package para a RNDS

A Rede Nacional de Dados em Saúde (RNDS) utiliza o padrão FHIR e define diversos artefatos de conformidade. Esses artefatos não são disponibilizados por meio de um NPM Package. O objetivo deste projeto é reunir esses artefatos em um NPM Package. Um NPM Package é imporante, por exemplo, para a ferramenta oficial de validação
de artefatos FHIR ([validator_cli](https://confluence.hl7.org/display/FHIR/Using+the+FHIR+Validator)).

A produção do NPM Package exigiu alguns ajustes visando a compatibilidade técnica com o padrão versão 4.0.1, sem alterar a semântica. As [mudanças](mudancas.md) estão devidamente 
documentadas.

**IMPORTANTE**: este conteúdo não é produzido pelo Ministério da Saúde (Brasil). Nenhuma garantia é oferecida. Trata-se de um trabalho em andamento.

## Gerar o NPM Package

Execute a versão .bat para Windows ou .sh para linux:
- `_updatePublisher.bat`
- `_genonce.bat`

O NPM Package será gerado no diretório **output** com o nome _package.tgz_.
Esta estratégia faz uso do IG Publisher para geração. Alternativamente, 
o comando abaixo simplesmente reúne os artefatos:

```
java -jar hapi-fhir-cli.jar create-package --version 0.0.1 -v r4 --description "rnds.ajustes" --name rnds.ajustes --include-package "./*.json"
```

Este comando depende do aplicativo **hapi-fhir-cli.jar** disponível em https://github.com/hapifhir/hapi-fhir/releases.

## Como usar o NPM Package gerado?

Para instalar localmente o NPM Package gerado
```
fhir install rnds.ajustes-0.0.1.tgz --file
```
O aplicativo **fhir** é disponibilizado em https://fire.ly/products/firely-terminal/.


Para validar a conformidade da instância de Patient contida no arquivo
_exemplos\paciente-cpf.json_, por exemplo, execute o comando abaixo:
```
java -jar validator_cli.jar -ig output\package.tgz exemplos\paciente-cpf.json
```

O [validator_cli](https://confluence.hl7.org/display/FHIR/Using+the+FHIR+Validator) é a ferramenta oficial para validação de artefatos FHIR.

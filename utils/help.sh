#!/bin/bash

# Verificar se foram fornecidos dois argumentos
if [ $# -ne 2 ]; then
    echo "Usage: $0 directory string_to_remove"
    exit 1
fi

diretorio=$1
string_a_remover=$2

# Loop pelos arquivos JSON no diretório
for arquivo in $diretorio*.json; do
    # Obter o nome do arquivo sem a extensão
    nome_arquivo=$(basename "$arquivo" .json)

    # Substituir o trecho do nome do arquivo pelo segundo argumento
    novo_id=$(echo "$nome_arquivo" | sed "s/$string_a_remover//")

    # Criar um novo arquivo temporário
    arquivo_temp=$(mktemp)

    # Substituir o conteúdo do campo "id" pelo novo_id
    jq --arg novo_id "$novo_id" '.id = $novo_id' "$arquivo" > "$arquivo_temp"

    # Substituir o arquivo original pelo arquivo temporário
    mv "$arquivo_temp" "$arquivo"
done
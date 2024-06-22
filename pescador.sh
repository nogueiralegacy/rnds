#!/bin/bash

export TERM=xterm-256color
export FORCE_COLOR=true

# Diretório que você deseja monitorar
diretorio="input/fsh/"

# Intervalo de tempo em segundos entre as execuções do comando
intervalo=5

# Timestamp da última execução do comando
ultima_execucao=5

echo ""
echo ""
echo ""

echo " ______   ______     ______     ______     ______     _____     ______     ______    "
echo "/\  == \ /\  ___\   /\  ___\   /\  ___\   /\  __ \   /\  __-.  /\  __ \   /\  == \   "
echo "\ \  _-/ \ \  __\   \ \___  \  \ \ \____  \ \  __ \  \ \ \/\ \ \ \ \/\ \  \ \  __<   "
echo " \ \_\    \ \_____\  \/\_____\  \ \_____\  \ \_\ \_\  \ \____-  \ \_____\  \ \_\ \_\ "
echo "  \/_/     \/_____/   \/_____/   \/_____/   \/_/\/_/   \/____/   \/_____/   \/_/ /_/ "

echo ""
echo ""

echo "O     O           ,       "
echo "  o o          .:/    "
echo "    o      ,,///;,   ,;/ "
echo "      o   o)::::::;;///"
echo "         >::::::::;;\\\ "
echo "           ''\\\\\'\" ';\ "
echo "              ';\ "

echo ""
echo ""
echo ""

if [ -f "./validador/validator_cli.jar" ]; then
    echo "Validador encontrado."
else
    echo "Validador não encontrado."
    echo "Tentando iniciar o download."
    mkdir -p validador
    http -d -o ./validador/validator_cli.jar https://github.com/hapifhir/org.hl7.fhir.core/releases/download/6.3.7/validator_cli.jar

fi

# # Executa o inotifywait no diretório especificado
# echo "Diretorio monitorado $diretorio"
# inotifywait -m -r -e create,delete,modify,move "$diretorio" |
# while read evento; do
#     echo "O evento $evento ocorreu no diretório $diretorio"
    
#     # Obtém o timestamp atual
#     timestamp_atual=$(date +%s)
    
#     # Verifica se já passou tempo suficiente desde a última execução do comando
#     diferenca=$((timestamp_atual - ultima_execucao))
#     if [ $diferenca -gt $intervalo ] || [ $ultima_execucao -eq 0 ]; then
#         echo "Acho que peguei alguns"
#         # Executa o seu comando aqui
#         sushi

#         java -jar validador/validator_cli.jar fsh-generated/resources/ -version 4.0.1 | grep -B 1 -A 4 "[1-9][0-9]* errors"

#         # Atualiza o timestamp da última execução
#         ultima_execucao=$timestamp_atual
#     else
#         echo "Rede vazia"        
#     fi    
# done

sushi 

echo "Remove json do IG apenas para validação"
rm fsh-generated/resources/ImplementationGuide-*.json

echo "Validando"
java -jar validador/validator_cli.jar exemplos/regulacao-01.json -version 4.0.1 -ig br.ufg.cgis.rnds-lite#dev | GREP_COLORS='mt=01;31:ms=01;31' grep -B 1 -A 12 --color=always "[1-9][0-9]* errors"


echo ' '
echo '><(((º>'
echo '           <°)))><'
echo '<°)))><              ><(((º>'
echo ' '
echo 'Fim!'
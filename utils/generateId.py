import json
import uuid
import os

def generate_uuid():
    return str(uuid.uuid4())

def add_new_id(instancia_json, new_id):
    instancia_json['id'] = new_id
    return instancia_json

def charge_json_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            json_data = json.load(file)

            return json_data

    except FileNotFoundError:
        print(f"Erro: Arquivo não encontrado - {file_path}")
    except json.JSONDecodeError:
        print(f"Erro: Falha ao decodificar o JSON no arquivo - {file_path}")
    except Exception as e:
        print(f"Erro inesperado: {e}")

def write_json_file(file_path, json_data):
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            json.dump(json_data, file, indent=4, ensure_ascii=False)
            return True
        
    except Exception as e:
        print(f"Erro ao tentar escrever no arquivo: {e}")
        return False

def change_all_ids(dir_path):
    count_all_files = 0
    count_files_change = 0
    if os.path.isdir(dir_path):
        all_filles_dir = os.listdir(dir_path)
        count_all_files = len(all_filles_dir)

        for file_path in all_filles_dir:
            file_path = os.path.join(dir_path, file_path)
            instancia_json = charge_json_file(file_path)
            add_new_id(instancia_json, generate_uuid())
            write_json_file(file_path, instancia_json)
            count_files_change += 1

        return count_all_files, count_files_change
    else:
        print(f"Erro: Diretório não encontrado - {dir_path}")
    


def main():
    dir_path = input("Digite o caminho do diretório: ")

    count_all_files, count_files_change = change_all_ids(dir_path)

    print(f"Total de arquivos: {count_all_files}")
    print(f"Total de arquivos alterados: {count_files_change}")

main()
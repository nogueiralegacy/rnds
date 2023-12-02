import os 
import json

def get_file_new_name(file_path):
    if (file_path.endswith(".json") and os.path.isfile(file_path)):
        with open(file_path, 'r', encoding='utf-8') as file:
            try:
                json_data = json.load(file)
                if 'url' in json_data:
                    new_file_name = json_data['url'].split('/')[-2] + '-' + json_data['url'].split('/')[-1] + '.json'

                    return new_file_name
            
            except json.JSONDecodeError as e:
                print(f"Erro: Falha ao decodificar o JSON no arquivo - {file_path}")
                print(f"Erro: {e}")

def rename_file(file_path, file_new_name):
    file_new_path = os.path.join(os.path.dirname(file_path), file_new_name)
    try:
        os.rename(file_path, file_new_path)
        return True
    except OSError as e:
        print(f"Erro ao tentar renomear o arquivo: {e}")
        return False

def rename_files(folder_path):
    count_all_files = 0
    count_rename_files = 0
    if os.path.isdir(folder_path):

        all_filles_dir = os.listdir(folder_path)
        count_all_files = len(all_filles_dir)

        for file_name in all_filles_dir:
            file_path = os.path.join(folder_path, file_name)

            if rename_file(file_path, get_file_new_name(file_path)):
                count_rename_files += 1
    
    else:
        print(f"Erro: Diretório não encontrado - {folder_path}")

    return count_all_files, count_rename_files

def main():
    folder_path = input("Digite o caminho do diretório: ")

    count_all_files, count_rename_files = rename_files(folder_path)

    print(f"Total de arquivos: {count_all_files}")
    print(f"Total de arquivos renomeados: {count_rename_files}")

if __name__ == "__main__":
    main()
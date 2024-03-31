import json

file_path = input("Digite o caminho do arquivo JSON: ")

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

#Corrige ausência de aspas em elementos
json_data = charge_json_file(file_path=file_path)
  
def walks_list(data, json_data, element_path):
    for item in data:
        new_path = element_path + f'[{data.index(item)}]'
        if isinstance(item, list):
            walks_list(item, json_data, new_path)
        elif isinstance(item, dict):
            walks_dict(item, json_data, new_path)
   
def walks_dict(data, json_data, element_path):
    for key, value in data.items():
        new_path = element_path + f'["{key}"]'
        if isinstance(value, list):
            walks_list(data=value, json_data=json_data, element_path=new_path)
        elif isinstance(value, dict):
            walks_dict(value, json_data, element_path=new_path)
        elif isinstance(value, int):
            if key == "code":
                update_json_data(json_data=json_data, element_path=new_path, value=value)


# EX: element_path = ["code"][2]["daniel"]
def update_json_data(json_data, element_path, value):
    command = f'json_data{element_path} = "{value}"'
    exec(command)


walks_dict(data=json_data, json_data=json_data, element_path="")

def write_json_file(file_path, json_data):
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            json.dump(json_data, file, indent=4, ensure_ascii=False)
            return True
        
    except Exception as e:
        print(f"Erro ao tentar escrever no arquivo: {e}")
        return False
    
write_json_file(file_path=file_path, json_data=json_data)

import json

def check_duplicate_codes(json_data):
    code_set = set()
    duplicates = []

    for concept in json_data.get("concept", []):
        code = concept.get("code")
        if code in code_set:
            duplicates.append(code)
        else:
            code_set.add(code)

    return duplicates

def main():
    file_path = input("Digite o caminho do Code System: ")

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            json_data = json.load(file)
            duplicates = check_duplicate_codes(json_data)

            if duplicates:
                print("Códigos duplicados encontrados:")
                for duplicate in duplicates:
                    print(f"- {duplicate}")
            else:
                print("Nenhum código duplicado encontrado.")

    except FileNotFoundError:
        print(f"Erro: Arquivo não encontrado - {file_path}")
    except json.JSONDecodeError:
        print(f"Erro: Falha ao decodificar o JSON no arquivo - {file_path}")
    except Exception as e:
        print(f"Erro inesperado: {e}")

if __name__ == "__main__":
main()

import json

class CategoryManager:
    def __init__(self):
        self.filename = "categories/categories.json"

    def edit_category(self, new_category_name, old_category_name):
        f = open(self.filename)
        print(old_category_name, new_category_name)
        data = json.load(f)
        if old_category_name in data["categories"]:
            data["categories"][data["categories"].index(old_category_name)] = new_category_name
            json_object = json.dumps(data, indent=4)
            with open(self.filename, "w") as outfile:
                outfile.write(json_object)
                return True
        return False

    def add_category(self, category_name):
        f = open(self.filename)
        data = json.load(f)
        if category_name not in data["categories"]:
            data["categories"].append(category_name)
            json_object = json.dumps(data, indent=4)
            with open(self.filename, "w") as outfile:
                outfile.write(json_object)
                return True
        return False


    def delete_category(self, category_name):
        f = open(self.filename)
        data = json.load(f)
        if category_name in data["categories"]:
            data["categories"].remove(category_name)
            json_object = json.dumps(data, indent=4)
            with open(self.filename, "w") as outfile:
                outfile.write(json_object)
                return True
        return False
        
    def get_categories(self):
        f = open(self.filename)
        data = json.load(f)
        return data


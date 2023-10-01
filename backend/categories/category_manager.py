

class CategoryManager:
    def __init__(self):
        self.filename = "categories.txt"

    def add_category(self, category_name):
        file = open(self.filename, 'r')
        lines = file.readlines()
        file.close()
        if category_name not in lines:
            lines.append(f"{category_name}\n")
            file1 = open(self.filename, 'w')
            file1.writelines(lines)
            file1.close()
            return True
        return False


    def delete_category(self, category_name):
        file = open(self.filename, 'r')
        lines = file.readlines()
        file.close()
        for i, line in enumerate(lines):
            if line == f"{category_name}\n":
                lines.delete(i)
                file1 = open(self.filename, 'w')
                file1.writelines(lines)
                file1.close()
                return True
        return False

    def get_categories(self):
        file = open(self.filename, 'r')
        lines = file.readlines()
        file.close()
        return lines

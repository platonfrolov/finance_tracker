import xlsxwriter
from xlsxwriter.utility import xl_rowcol_to_cell
from collections import defaultdict

class ExcelGenerator:
    def __init__(self, data):
        self.workbook = xlsxwriter.Workbook("data/xlsxs/overview.xlsx")
        self.worksheet = self.workbook.add_worksheet()
        self.data = data

    def organize_data(self):
        print(self.data)
        organized_data = defaultdict(list)
        for entry in self.data:
            relevant_data = {
                "name": entry["name"],
                "date": entry["date"],
                "amount": entry["amount"]
            }
            organized_data[entry["state"]].append(relevant_data)
        return organized_data

    def populate_workbook(self, organized_data):
        # Add a bold format to use to highlight cells.
        bold = self.workbook.add_format({"bold": True})      
        categories = list(organized_data.keys())
        nr_categories = len(categories)
        nr_transactions_per_category = [len(organized_data[category]) for category in organized_data]
        max_nr_transactions_per_category = max(nr_transactions_per_category)
        self.worksheet.set_column(0, 3*nr_categories - 1, 20)
        for idx, key in enumerate(categories):
            print(key, 1, idx*3)
            self.worksheet.write(1, idx*3, key, bold)
            for obj_idx, obj in enumerate(organized_data[key]):
                row = obj_idx+2
                self.worksheet.write(row, 3*idx+0, obj["name"])
                self.worksheet.write(row, 3*idx+1, obj["date"])
                self.worksheet.write(row, 3*idx+2, obj["amount"])
        for idx, key in enumerate(categories):
            start_cell = xl_rowcol_to_cell(1, 3*idx+2)  # C2
            end_cell = xl_rowcol_to_cell(max_nr_transactions_per_category, 3*idx+2)
            self.worksheet.write(max_nr_transactions_per_category + 2, 3*idx+1, "Total:", bold)
            self.worksheet.write(max_nr_transactions_per_category + 2, 3*idx+2, f'=SUM({start_cell}:{end_cell})', bold)

    def execute(self):
        organized_data = self.organize_data()
        self.populate_workbook(organized_data)
        self.workbook.close()
            
        

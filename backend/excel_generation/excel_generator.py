import xlsxwriter
from xlsxwriter.utility import xl_rowcol_to_cell
from collections import defaultdict

class ExcelGenerator:
    def __init__(self, data):
        self.workbook = xlsxwriter.Workbook("data/xlsxs/overview.xlsx")
        self.worksheet = self.workbook.add_worksheet()
        self.data = data
        self.bold = self.workbook.add_format({"bold": True}) 

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
        categories = list(organized_data.keys())
        nr_categories = len(categories)
        nr_transactions_per_category = [len(organized_data[category]) for category in organized_data]
        max_nr_transactions_per_category = max(nr_transactions_per_category)
        self.worksheet.set_column(0, 3*nr_categories - 1, 20)
        for idx, key in enumerate(categories):
            print(key, 1, idx*3)
            self.worksheet.write(1, idx*3, key, self.bold)
            for obj_idx, obj in enumerate(organized_data[key]):
                row = obj_idx+2
                self.worksheet.write(row, 3*idx+0, obj["name"])
                self.worksheet.write(row, 3*idx+1, obj["date"])
                self.worksheet.write(row, 3*idx+2, obj["amount"])
        for idx, key in enumerate(categories):
            start_cell = xl_rowcol_to_cell(1, 3*idx+2)
            end_cell = xl_rowcol_to_cell(max_nr_transactions_per_category, 3*idx+2)
            self.worksheet.write(max_nr_transactions_per_category + 2, 3*idx+1, "Total:", self.bold)
            self.worksheet.write(max_nr_transactions_per_category + 2, 3*idx+2, f'=SUM({start_cell}:{end_cell})', self.bold)
        return max_nr_transactions_per_category + 5

    def draw_chart(self, organized_data, chart_row):
        totals = defaultdict(int)
        
        for category in organized_data:
            for entry in organized_data[category]:
                totals[category] += entry["amount"]
        nr_categories = len(totals)
        total = sum(list(totals.values()))
        self.worksheet.write_column(chart_row, 2, list(totals.keys()))
        self.worksheet.write(chart_row + nr_categories, 2, "Total:", self.bold)
        self.worksheet.write_column(chart_row, 3, list(totals.values()))
        start_cell = xl_rowcol_to_cell(chart_row, 3)
        end_cell = xl_rowcol_to_cell(chart_row+nr_categories - 1, 3)
        self.worksheet.write(chart_row + nr_categories, 3, f'=SUM({start_cell}:{end_cell})', self.bold)
        self.worksheet.write_column(chart_row, 4, list(map(lambda x: x*100/total, list(totals.values()))))
        self.worksheet.write(chart_row + nr_categories, 4, 100, self.bold)
        chart = self.workbook.add_chart({"type": "pie"})
        chart.add_series(
            {
                "name": "Expenses per category",
                "categories": ["Sheet1", chart_row, 2, chart_row+nr_categories-1, 2],
                "values": ["Sheet1", chart_row, 3, chart_row+nr_categories-1, 3],
            }
        )
        # Add a title.
        chart.set_title({"name": "Expenses per category"})

        # Set an Excel chart style. Colors with white outline and shadow.
        chart.set_style(10)

        # Insert the chart into the worksheet (with an offset).
        self.worksheet.insert_chart(chart_row, 5, chart, {"x_offset": 25, "y_offset": 10})
        
            


    def execute(self):
        organized_data = self.organize_data()
        chart_row = self.populate_workbook(organized_data)
        self.draw_chart(organized_data, chart_row)
        self.workbook.close()
            
        

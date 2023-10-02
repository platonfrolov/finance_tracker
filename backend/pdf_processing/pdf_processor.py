from pdfquery import PDFQuery
from collections import defaultdict
from dateutil.parser import parse
import pandas as pd

class PDFProcessor:
    def __init__(self, pdf_path) -> None:
        self.pdf_path = pdf_path
        self.pdf = PDFQuery(pdf_path)
        self.pdf.load()

    @staticmethod
    def check_is_date(s, fuzzy=False):
        s = s.strip()
        try: 
            parse(s, fuzzy=fuzzy)
            return True
        except ValueError:
            return False
        except OverflowError:
            return False
        
    @staticmethod
    def check_is_float(s):
        s = s.strip()
        s = s.replace(".", "")
        s = s.replace(",", ".")
        try:
            float(s)
            return True
        except ValueError:
            return False
    
    def to_float(s):
        try:
            f = float(s)
            return f
        except ValueError:
            print("error while parsing amount")


    @staticmethod
    def check_is_amount(s):
        if (s.startswith("+") and PDFProcessor.check_is_float(s.split("+")[1])) or (s.startswith("-") and PDFProcessor.check_is_float(s.split("-")[1])):
            return True
        return False

    @staticmethod
    def check_is_relevant(row_data):
        has_amount = False 
        for element in row_data:
            if PDFProcessor.check_is_amount(element):
                has_amount = True  
        return has_amount
    
    def parse_pdf(self):
        tree = self.pdf.tree
        root = tree.getroot()
        # children = root[1].getchildren()
        pages = [root[i] for i in range(len(root.getchildren()))]
        all_transactions = []
        for page in pages:
            relevant_elements = []
            for item in page.findall(".//LTTextLineHorizontal"):
                relevant_elements.append(item)

            for item in page.findall(".//LTTextBoxHorizontal"):
                relevant_elements.append(item)


            d = defaultdict(list)
            for element in relevant_elements:
                if "y1" in element.attrib:
                    d[float(element.attrib["y1"])].append(element)

            row_order = list(d.keys())
            row_order = sorted(row_order, reverse=True)

            for i, row in enumerate(row_order):
                r = [el.text for el in d[row] if el.text != ""]
                if PDFProcessor.check_is_relevant(r):
                    all_transactions.append(r)

        for transaction in all_transactions:
            if len(transaction) == 3:
                date = transaction[0].split(" ")[0]
                rest = transaction[0].split(f"{date} ")[1]
                transaction.insert(1,date)
                transaction[0] = rest
            assert len(transaction) == 4, "missing some info"
            if transaction[0].startswith("Name: "):
                transaction[0] = transaction[0].split("Name: ")[1]
            for i in range(1,4):
                if PDFProcessor.check_is_amount(transaction[i]):
                    transaction[2], transaction[i] = transaction[i], transaction[2]
                elif PDFProcessor.check_is_date(transaction[i]):
                    transaction[1], transaction[i] = transaction[i], transaction[1]
                else:
                    transaction[3], transaction[i] = transaction[i], transaction[3]
                    transaction[3] = transaction[3].replace(" ", "")
            transaction[2] = transaction[2].replace(".", "")
            transaction[2] = transaction[2].replace(",", ".")
            transaction[2] = transaction[2].replace(" ", "")
            
            print(transaction[2])
            transaction[2] = PDFProcessor.to_float(transaction[2])
        return all_transactions
    
    def to_dataframe(self, transactions):
        df = pd.DataFrame(transactions, columns=["name", "date", "amount", "type"])
        return df
    
    def construct_csv_filepath(self):
        pdf_filepath_split = self.pdf_path.split("/")
        pdf_filename = pdf_filepath_split[-1]
        filename = pdf_filename.split(".")[0]
        csv_filename = filename + ".csv"
        del pdf_filepath_split[-1]
        del pdf_filepath_split[-1]
        csv_filepath_split = pdf_filepath_split
        csv_filepath_split.append("csvs")
        csv_filepath_split.append(csv_filename)
        csv_filepath = ' '.join([str(item) for item in csv_filepath_split])
        return csv_filepath
    
    def save_to_csv(self, df):
        csv_filepath = self.construct_csv_filepath()
        df.to_csv(csv_filepath, header=False)

    
    def execute(self):
        transactions = self.parse_pdf()
        df = self.to_dataframe(transactions)
        self.save_to_csv(df)
        return df

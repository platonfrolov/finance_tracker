from fastapi import Request, FastAPI, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from api.api_helper import APIHelper
from pdf_processing.pdf_processor import PDFProcessor
from categories.category_manager import CategoryManager
from excel_generation.excel_generator import ExcelGenerator
import json

category_manager = CategoryManager()
api_helper = APIHelper()
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload_pdf")
async def upload_pdf(request: Request):
    data = await request.json()
    pdfs_path = "./data/pdfs/"
    filename = data["filename"]
    payload = data["payload"]
    filepath = APIHelper.decode_and_save_pdf(payload, filename, pdfs_path)
    pdf_processor = PDFProcessor(filepath)
    df = pdf_processor.execute()
    result = df.to_json(orient="records")
    return Response(content=result, media_type="application/json")

@app.post("/create_overview")
async def create_overview(request: Request):
    data = await request.json()
    excel_generator = ExcelGenerator(data["payload"])
    excel_generator.execute()
    return 200

@app.post("/edit_category")
async def edit_category(request: Request):
    data = await request.json()
    category_manager.edit_category(data["payload"]["newName"], data["payload"]["oldName"])
    return 200

@app.post("/create_category")
async def create_category(request: Request):
    data = await request.json()
    category_manager.add_category(data["payload"])
    return 200

@app.delete("/delete_category")
async def delete_category(request: Request):
    data = await request.json()
    category_manager.delete_category(data["payload"])
    return 200

@app.get("/get_categories")
async def get_categories(request: Request):
    result = json.dumps(category_manager.get_categories())
    return Response(content=result, media_type="application/json")




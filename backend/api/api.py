from fastapi import Request, FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleWare
from api_helper import APIHelper


api_helper = APIHelper()
app = FastAPI()

origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleWare,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/upload_pdf")
async def upload_pdf(request: Request):
    data = await request.json()
    pdfs_path = "../data/pdfs"
    filename = data["filename"]
    payload = data["payload"]
    APIHelper.decode_and_save_pdf(payload, filename, pdfs_path)
    

@app.post("/create_category")
async def create_category(request: Request):
    pass

@app.delete("/delete_category")
async def delete_category(request: Request):
    pass

@app.get("/get_categories")
async def get_categories(request: Request):
    pass

@app.post("create_overview")
async def create_overview(request: Request):
    pass


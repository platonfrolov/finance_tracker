# finance_tracker
My personal finance tracking tool


##run as follows: 
#build docker files:
docker build -t frontend:latest -f Dockerfile.frontend .
docker build -t backend:latest -f Dockerfile.backend .

#run docker files:
docker run -p 3000:3000 frontend:latest
docker run -p 8000:8000 backend:latest

Go to localhost:3000 in a browser

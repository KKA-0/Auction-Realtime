# Auction-Realtime
Web Application build with MERN stack, for Realtime Auction on Products


## Run development Local server 
### ReactJs - Frontend

#### add .env file in client folder
```
./client/.env

VITE_APP_DOMAIN="http://localhost:3000"
```

```
cd client
npm install
npm run dev
```

``client port:``  http://localhost:5173/


### NodeJs - Backend

#### add .env file in server folder
```
./server/.env

SECRET_JWT=SECRET_JWT
DB_URI=mongodb connection string
```

```
cd server
npm install
npm run build
npm run start
```


``server port:``  http://localhost:3000/


``Note on Scalability:``

This project uses JavaScript Maps for managing auction timers, which helps speed up development and simplifies task scheduling. However, this solution is not ideal for large-scale systems as it relies on in-memory storage, which lacks persistence and fault tolerance. For production-level scalability, a Background Job Queue or event-driven architecture would be more suitable.


https://github.com/user-attachments/assets/5c9efae5-d4ba-4c30-a789-eed962a0f97f



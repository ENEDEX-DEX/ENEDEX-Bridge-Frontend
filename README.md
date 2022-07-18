There are frontend and backend in bridge.
Backend is nodejs server.


-frontend
I already set the bridge and token contract in this frontend.
The main files are config(src->utils) and BridgContainer(src->container).
There are contract address on these files.
And you have to change the server url on axios.ts(src-> utils)
Now baseURL is "http://localhost:5000/"

-backend
You have to enter the private key over here.
adminAccount(utils-> adminAccount.ts) file.
And you can update the bridge and token contract on config(utils-> config.ts) file.
And router address is on minter.router.ts(routes)
And now the server url is localhost:5000
You have to update this on server.ts
And you have to "yarn build" the server file and upload the dist folder to server.


-server setup method
1. frontend
First open the command prompt on source code of frontend and enter the "yarn build". Once finish the build, build file will be created to your source code of frontend.
And then you have to upload the files in build folder to hosting server.

2. backend
First open the command prompt on source code of backend and enter the "yarn install". After install of backend and then enter the "yarn build". Once finish the build, the 
dist folder will be created. Finally please upload the files in dist folder to hosting server of backend



-get back the token on Bridge
The admin wallet can get back the tokens from bridge contract. (BSC Bridge contract: https://bscscan.com/address/0x4aD3052035147636B37E669F9D5fE4298b03F567)
There are two functions on Bridge contract. Burn and mint functions.
Burn is for lock and mint is for unlock on BSC Bridge.
So admin wallet can get back the tokens using mint(unlock) function on BSC Bridge.
You just enter the receiver address and token amount in this window 

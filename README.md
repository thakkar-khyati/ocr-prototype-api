this repository is prototype for the OCR project. 
in this i have created User service with sequlize posrgresql database which is run on aspire server. i have also added redis database for cache memory at server side
it also has web socket for notifaction and sending asyns response from third party api to react app.
it is connected with eureka server("http://192.168.2.79:8761) and api gateway("http://192.168.2.79:8999") 
it is also connected to react app on("http://192.168.2.84:3000")
this node server is running on "http://192/168.2.30:3000"

to run this server we have to run redis-server in terminal in the folder then run npm run dev
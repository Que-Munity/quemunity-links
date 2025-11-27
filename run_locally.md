to run this locally into your system first you have to download and install postgresql from official website:
keep the port number default and set any password.


Go to .env.local at line number 4 change database url:
just change irtaza20 with your password of postgre:

postgresql://postgres:<your_password>localhost:5432/quemunity_dev


postgresql://postgres:irtaza20@localhost:5432/quemunity_dev



After that first run this command in terminal: npm run db:studio

once this command execute run this command:
npm run dev.

you are good to go it make database sutructure and run project localy.
#create our working directory if it doesnt exist
DIR="/home/ubuntu/NodeJsProjectCMS"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi

cd /home/ubuntu/NodeJsProjectCMS
pm2 delete index.js
pm2 start index.js
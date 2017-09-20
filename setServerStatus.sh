#!/bin/bash

# sysinfo_page - A script to update the server mode

set_status () { 
  echo "Updating server status to $1"
  
  echo "Calling: mongo polymorph --eval \"db.servermodes.update({}, {'server_mode': '$1'})\""
  echo "--------"
  mongo polymorph --eval "db.servermodes.update({}, {'server_mode': '$1'},{upsert:true})" 
  echo "--------"
  echo "Server status updated"
  echo "Fetching server mode"
  echo "--------"
  mongo polymorph --eval "db.servermodes.find({})" 
  echo "--------"
  exit
}

if [ $# -lt 1 ]; then 
    echo "You're missing a server status argument."
    echo "Usage: setServerStatus <status>"
elif [ $# -gt 1 ]; then 
    echo "You have used too many arguments."
    echo "Usage: setServerStatus <status>"
else 
  echo $1
  set_status $1
fi 

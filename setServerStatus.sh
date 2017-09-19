#!/bin/bash

# sysinfo_page - A script to update the server mode

set_status () { 
  echo "Updating server status to $1"
  
  mongo polymorph --eval "db.servermodes.update({}, {'server_mode': $1})"
  mongo polymorph --eval "db.servermodes.update({}, {'server_mode': $1})"
  
  echo "Server status updated"
  exit
}

if [ $# -lt 1 ]; then 
    echo "You're missing a server status argument."
    echo "Usage: setServerStatus <status>"
elif [ $# -gt 1 ]; then 
    echo "You have used too many arguments."
    echo "Usage: setServerStatus <status>"
else 
  set_status
fi 

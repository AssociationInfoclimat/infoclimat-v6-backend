#!/bin/bash

indexer -c /etc/sphinxsearch/sphinxy.conf --all

echo "Start searchd.."
./searchd.sh


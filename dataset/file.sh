#!/bin/bash

directory="/Users/sikk/project_dream/Join_Project_v2/dataset/DatasetForExperiment/HuangGaiDataset/originalVersion/integerOverflow"
output_file="/Users/sikk/project_dream/Join_Project_v2/dataset/dream-integerOverflow-name.txt"
cd "$directory"

echo "" > "$output_file"

for file in *.sol; do
    echo "Running dream command on $file"
    echo "${file%.sol}" >> "$output_file"
    echo "" >> "$output_file"
done
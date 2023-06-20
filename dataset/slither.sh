#!/bin/bash

directory="/Users/sikk/project_dream/Join_Project_v2/dataset/DatasetForExperiment/HuangGaiDataset/originalVersion/forcedToReceiveEthers"
output_file="/Users/sikk/project_dream/Join_Project_v2/dataset/slither-forcedToReceiveEthers.txt"

python_script="/Users/sikk/project_dream/Join_Project_v2/dataset/solc.py"

cd "$directory"
echo "" > "$output_file"

for file in *.sol; do
    echo $(python3 "$python_script" "$file")
    echo "Running dream command on $file"
    output=$(slither "$file" --detect incorrect-equality 2>&1)

    echo "Filename: $file" >> "$output_file"
    echo "Output: $output" >> "$output_file"
    cat "${file%.sol}Info.txt" >> "$output_file"

    echo "" >> "$output_file"

done

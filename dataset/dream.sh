#!/bin/bash

directory="/Users/sikk/project_dream/Join_Project_v2/dataset/DatasetForExperiment/HuangGaiDataset/originalVersion/integerOverflow"
output_file="/Users/sikk/project_dream/Join_Project_v2/dataset/dream-integerOverflow.txt"
cd "$directory"

echo "" > "$output_file"

for file in *.sol; do
    echo "Running dream command on $file"
    output=$(dream detect vuln TooManyDigits ArithmeticUnderOverFlow "$file")

    echo "Filename: $file" >> "$output_file"
    echo "Output: $output" >> "$output_file"
    cat "${file%.sol}Info.txt" >> "$output_file"
    echo "" >> "$output_file"
done